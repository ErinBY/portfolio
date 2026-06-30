const fileInput = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const convertButton = document.getElementById("convertButton");
const resetButton = document.getElementById("resetButton");
const downloadButton = document.getElementById("downloadButton");
const fileMeta = document.getElementById("fileMeta");
const resultSummary = document.getElementById("resultSummary");
const previewText = document.getElementById("previewText");
const statusMessage = document.getElementById("statusMessage");

let selectedFile = null;
let convertedText = "";
let convertedFilename = "";

function setStatus(message, tone = "") {
  statusMessage.textContent = message;
  statusMessage.className = "status";
  if (tone) {
    statusMessage.classList.add(tone);
  }
}

function renderFileMeta(file) {
  if (!file) {
    fileMeta.innerHTML = "<span>선택된 파일이 없습니다.</span>";
    return;
  }

  const sizeKb = (file.size / 1024).toFixed(1);
  fileMeta.innerHTML = `
    <span>파일명: ${file.name}</span>
    <span>크기: ${sizeKb} KB</span>
    <span>형식: ${file.name.split(".").pop().toUpperCase()}</span>
  `;
}

function renderResultPlaceholder() {
  resultSummary.innerHTML = "<span>아직 변환된 결과가 없습니다.</span>";
  previewText.textContent = "변환된 텍스트가 여기에 표시됩니다.";
  downloadButton.disabled = true;
  convertedText = "";
  convertedFilename = "";
}

function selectFile(file) {
  selectedFile = file || null;
  convertButton.disabled = !selectedFile;
  renderFileMeta(selectedFile);
  renderResultPlaceholder();

  if (selectedFile) {
    setStatus("파일이 준비되었습니다. 변환 버튼을 눌러주세요.");
  } else {
    setStatus("파일을 선택하면 변환을 시작할 수 있습니다.");
  }
}

function isSupportedFile(file) {
  if (!file) {
    return false;
  }

  const lowerName = file.name.toLowerCase();
  return lowerName.endsWith(".hwp") || lowerName.endsWith(".hwpx");
}

dropzone.addEventListener("click", () => fileInput.click());

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("is-dragging");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("is-dragging");
});

dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("is-dragging");

  const [file] = event.dataTransfer.files;
  if (!isSupportedFile(file)) {
    setStatus("지원하지 않는 형식입니다. HWP 또는 HWPX 파일을 선택해주세요.", "is-error");
    return;
  }

  selectFile(file);
});

fileInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) {
    selectFile(null);
    return;
  }

  if (!isSupportedFile(file)) {
    setStatus("지원하지 않는 형식입니다. HWP 또는 HWPX 파일을 선택해주세요.", "is-error");
    fileInput.value = "";
    return;
  }

  selectFile(file);
});

resetButton.addEventListener("click", () => {
  fileInput.value = "";
  selectFile(null);
});

convertButton.addEventListener("click", async () => {
  if (!selectedFile) {
    setStatus("먼저 변환할 파일을 선택해주세요.", "is-error");
    return;
  }

  convertButton.disabled = true;
  downloadButton.disabled = true;
  previewText.textContent = "문서에서 텍스트를 추출하는 중입니다...";
  resultSummary.innerHTML = `<span>${selectedFile.name} 변환 진행 중</span>`;
  setStatus("변환 중입니다. 문서 구조에 따라 몇 초 정도 걸릴 수 있습니다.");

  try {
    const response = await fetch("/api/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Filename": encodeURIComponent(selectedFile.name)
      },
      body: await selectedFile.arrayBuffer()
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "변환에 실패했습니다.");
    }

    convertedText = payload.text;
    convertedFilename = payload.output_name;
    previewText.textContent = payload.text || "추출된 텍스트가 없습니다.";
    resultSummary.innerHTML = `
      <span>원본: ${payload.source_name}</span>
      <span>결과: ${payload.output_name}</span>
      <span>추출 방식: ${payload.mode}</span>
    `;
    downloadButton.disabled = !payload.text;
    setStatus("변환이 완료되었습니다. 미리보기를 확인하고 TXT를 다운로드하세요.", "is-success");
  } catch (error) {
    renderResultPlaceholder();
    setStatus(error.message || "변환 중 오류가 발생했습니다.", "is-error");
  } finally {
    convertButton.disabled = !selectedFile;
  }
});

downloadButton.addEventListener("click", () => {
  if (!convertedText) {
    return;
  }

  const blob = new Blob([convertedText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = convertedFilename || "converted.txt";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
});

renderFileMeta(null);
renderResultPlaceholder();
