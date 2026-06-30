from __future__ import annotations

import io
import json
import re
import struct
import urllib.parse
import zipfile
import zlib
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Dict, List
from xml.etree import ElementTree as ET


BASE_DIR = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8000


def local_name(tag: str) -> str:
    if "}" in tag:
        return tag.rsplit("}", 1)[1]
    if ":" in tag:
        return tag.rsplit(":", 1)[1]
    return tag


def normalize_text(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def cleanup_hwp_text(text: str) -> str:
    cleaned_lines: List[str] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        line = re.sub(r"^[\u3400-\u9FFF]+", "", line)
        line = re.sub(r"[\u3400-\u9FFF]+$", "", line)
        line = line.strip()

        if not line:
            cleaned_lines.append("")
            continue

        if re.fullmatch(r"[\u3400-\u9FFF\s]+", line):
            continue

        cleaned_lines.append(line)

    return normalize_text("\n".join(cleaned_lines))


def convert_hwpx_to_text(file_bytes: bytes) -> str:
    with zipfile.ZipFile(io.BytesIO(file_bytes)) as archive:
        section_names = sorted(
            name
            for name in archive.namelist()
            if name.lower().startswith("contents/section") and name.lower().endswith(".xml")
        )

        if not section_names:
            raise ValueError("HWPX 본문 섹션을 찾지 못했습니다.")

        paragraphs: List[str] = []
        for name in section_names:
            xml_bytes = archive.read(name)
            root = ET.fromstring(xml_bytes)

            for element in root.iter():
                if local_name(element.tag) != "p":
                    continue
                text = "".join(element.itertext())
                text = normalize_text(text)
                if text:
                    paragraphs.append(text)

        if not paragraphs:
            raise ValueError("HWPX 문서에서 추출 가능한 텍스트를 찾지 못했습니다.")

        return "\n\n".join(paragraphs)


class OLEFile:
    END_OF_CHAIN = 0xFFFFFFFE
    FREE_SECTOR = 0xFFFFFFFF
    NO_STREAM = 0xFFFFFFFF

    def __init__(self, data: bytes) -> None:
        self.data = data
        self.sector_size = 1 << struct.unpack_from("<H", data, 30)[0]
        self.mini_sector_size = 1 << struct.unpack_from("<H", data, 32)[0]
        self.first_dir_sector = struct.unpack_from("<I", data, 48)[0]
        self.mini_stream_cutoff = struct.unpack_from("<I", data, 56)[0]
        self.first_minifat_sector = struct.unpack_from("<I", data, 60)[0]
        self.num_minifat_sectors = struct.unpack_from("<I", data, 64)[0]
        self.first_difat_sector = struct.unpack_from("<I", data, 68)[0]
        self.num_difat_sectors = struct.unpack_from("<I", data, 72)[0]
        self.fat = self._load_fat()
        self.directories = self._load_directories()
        self.root_entry = self.directories["Root Entry"]
        self.mini_stream = self._read_normal_stream(
            self.root_entry["start"], self.root_entry["size"]
        )
        self.minifat = self._load_minifat()

    def _sector_offset(self, sector_id: int) -> int:
        return (sector_id + 1) * self.sector_size

    def _collect_sector_chain(self, start_sector: int, fat: List[int]) -> List[int]:
        chain: List[int] = []
        sector = start_sector
        seen = set()
        while sector not in (self.END_OF_CHAIN, self.FREE_SECTOR, self.NO_STREAM):
            if sector >= len(fat) or sector in seen:
                break
            chain.append(sector)
            seen.add(sector)
            sector = fat[sector]
        return chain

    def _load_fat(self) -> List[int]:
        difat = list(struct.unpack_from("<109I", self.data, 76))
        fat_sectors = [sector for sector in difat if sector != self.FREE_SECTOR]

        next_difat = self.first_difat_sector
        for _ in range(self.num_difat_sectors):
            if next_difat in (self.END_OF_CHAIN, self.FREE_SECTOR):
                break
            offset = self._sector_offset(next_difat)
            count = self.sector_size // 4 - 1
            difat_entries = struct.unpack_from(f"<{count}I", self.data, offset)
            fat_sectors.extend(
                sector for sector in difat_entries if sector != self.FREE_SECTOR
            )
            next_difat = struct.unpack_from("<I", self.data, offset + self.sector_size - 4)[0]

        fat: List[int] = []
        for sector in fat_sectors:
            offset = self._sector_offset(sector)
            fat.extend(struct.unpack_from(f"<{self.sector_size // 4}I", self.data, offset))
        return fat

    def _load_directories(self) -> Dict[str, Dict[str, int]]:
        directories: Dict[str, Dict[str, int]] = {}
        for sector in self._collect_sector_chain(self.first_dir_sector, self.fat):
            offset = self._sector_offset(sector)
            chunk = self.data[offset : offset + self.sector_size]
            for cursor in range(0, self.sector_size, 128):
                entry = chunk[cursor : cursor + 128]
                name_length = struct.unpack_from("<H", entry, 64)[0]
                if name_length < 2:
                    continue
                name = entry[: name_length - 2].decode("utf-16le", errors="ignore")
                directories[name] = {
                    "type": entry[66],
                    "start": struct.unpack_from("<I", entry, 116)[0],
                    "size": struct.unpack_from("<Q", entry, 120)[0],
                }
        return directories

    def _load_minifat(self) -> List[int]:
        if self.first_minifat_sector in (self.END_OF_CHAIN, self.FREE_SECTOR):
            return []

        minifat: List[int] = []
        for sector in self._collect_sector_chain(self.first_minifat_sector, self.fat):
            offset = self._sector_offset(sector)
            minifat.extend(
                struct.unpack_from(f"<{self.sector_size // 4}I", self.data, offset)
            )
        return minifat

    def _read_normal_stream(self, start_sector: int, size: int) -> bytes:
        if start_sector in (self.END_OF_CHAIN, self.FREE_SECTOR, self.NO_STREAM):
            return b""
        chunks = bytearray()
        for sector in self._collect_sector_chain(start_sector, self.fat):
            offset = self._sector_offset(sector)
            chunks.extend(self.data[offset : offset + self.sector_size])
        return bytes(chunks[:size])

    def _read_mini_stream(self, start_sector: int, size: int) -> bytes:
        if not self.minifat:
            return b""
        chunks = bytearray()
        sector = start_sector
        seen = set()
        while sector not in (self.END_OF_CHAIN, self.FREE_SECTOR, self.NO_STREAM):
            if sector >= len(self.minifat) or sector in seen:
                break
            offset = sector * self.mini_sector_size
            chunks.extend(self.mini_stream[offset : offset + self.mini_sector_size])
            seen.add(sector)
            sector = self.minifat[sector]
        return bytes(chunks[:size])

    def read_stream(self, name: str) -> bytes:
        entry = self.directories.get(name)
        if not entry:
            return b""
        size = entry["size"]
        if size < self.mini_stream_cutoff and name != "Root Entry":
            return self._read_mini_stream(entry["start"], size)
        return self._read_normal_stream(entry["start"], size)


def record_payloads(section_bytes: bytes) -> List[bytes]:
    cursor = 0
    payloads: List[bytes] = []

    while cursor + 4 <= len(section_bytes):
        header = struct.unpack_from("<I", section_bytes, cursor)[0]
        cursor += 4

        tag_id = header & 0x3FF
        size = (header >> 20) & 0xFFF
        if size == 0xFFF:
            if cursor + 4 > len(section_bytes):
                break
            size = struct.unpack_from("<I", section_bytes, cursor)[0]
            cursor += 4

        payload = section_bytes[cursor : cursor + size]
        cursor += size

        if tag_id == 67 and payload:
            payloads.append(payload)

    return payloads


def decode_paragraph_payload(payload: bytes) -> str:
    if len(payload) % 2 == 1:
        payload = payload[:-1]
    text = payload.decode("utf-16le", errors="ignore")
    text = "".join(ch for ch in text if ch == "\n" or ch == "\t" or ord(ch) >= 32)
    return normalize_text(text)


def convert_hwp_to_text(file_bytes: bytes) -> tuple[str, str]:
    ole = OLEFile(file_bytes)
    header = ole.read_stream("FileHeader")
    if not header:
        raise ValueError("HWP 파일 헤더를 읽지 못했습니다.")

    properties = struct.unpack_from("<I", header, 36)[0]
    compressed = bool(properties & 0x01)

    paragraphs: List[str] = []
    section_names = sorted(
        name for name in ole.directories if name.lower().startswith("section")
    )

    for section_name in section_names:
        raw_section = ole.read_stream(section_name)
        if not raw_section:
            continue

        if compressed:
            try:
                raw_section = zlib.decompress(raw_section, -15)
            except zlib.error:
                pass

        for payload in record_payloads(raw_section):
            text = decode_paragraph_payload(payload)
            if text:
                paragraphs.append(text)

    if paragraphs:
        return cleanup_hwp_text("\n\n".join(paragraphs)), "hwp-body"

    preview = ole.read_stream("PrvText")
    if preview:
        text = preview.decode("utf-16le", errors="ignore").replace("\x00", "")
        text = cleanup_hwp_text(text)
        if text:
            return text, "hwp-preview"

    raise ValueError("HWP 문서에서 추출 가능한 텍스트를 찾지 못했습니다.")


def convert_document(filename: str, file_bytes: bytes) -> tuple[str, str]:
    suffix = Path(filename).suffix.lower()
    if suffix == ".hwpx":
        return convert_hwpx_to_text(file_bytes), "hwpx-body"
    if suffix == ".hwp":
        return convert_hwp_to_text(file_bytes)
    raise ValueError("지원하지 않는 파일 형식입니다.")


class AppHandler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        path = urllib.parse.urlparse(self.path).path
        if path == "/":
            self._serve_file("index.html", "text/html; charset=utf-8")
            return
        if path == "/styles.css":
            self._serve_file("styles.css", "text/css; charset=utf-8")
            return
        if path == "/script.js":
            self._serve_file("script.js", "application/javascript; charset=utf-8")
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Not found")

    def do_POST(self) -> None:
        path = urllib.parse.urlparse(self.path).path
        if path != "/api/convert":
            self.send_error(HTTPStatus.NOT_FOUND, "Not found")
            return

        filename = urllib.parse.unquote(self.headers.get("X-Filename", "")).strip()
        if not filename:
            self._send_json({"error": "파일명이 전달되지 않았습니다."}, HTTPStatus.BAD_REQUEST)
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        file_bytes = self.rfile.read(content_length)
        if not file_bytes:
            self._send_json({"error": "업로드된 파일이 없습니다."}, HTTPStatus.BAD_REQUEST)
            return

        try:
            text, mode = convert_document(filename, file_bytes)
            output_name = f"{Path(filename).stem}.txt"
            self._send_json(
                {
                    "source_name": filename,
                    "output_name": output_name,
                    "mode": mode,
                    "text": text,
                }
            )
        except zipfile.BadZipFile:
            self._send_json(
                {"error": "손상되었거나 올바르지 않은 HWPX 파일입니다."},
                HTTPStatus.BAD_REQUEST,
            )
        except ValueError as error:
            self._send_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
        except Exception:
            self._send_json(
                {"error": "문서 변환 중 예기치 않은 오류가 발생했습니다."},
                HTTPStatus.INTERNAL_SERVER_ERROR,
            )

    def log_message(self, format: str, *args) -> None:
        return

    def _serve_file(self, filename: str, content_type: str) -> None:
        path = BASE_DIR / filename
        if not path.exists():
            self.send_error(HTTPStatus.NOT_FOUND, "Not found")
            return
        payload = path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _send_json(self, payload: dict, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"Server running at http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
