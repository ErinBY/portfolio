import { useState, useEffect } from "react";
import { Mail, Github } from "lucide-react";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "timeline", "skills", "projects", "how-i-work", "contact"];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "홈" },
    { id: "about", label: "소개" },
    { id: "timeline", label: "타임라인" },
    { id: "skills", label: "스킬" },
    { id: "projects", label: "프로젝트" },
    { id: "how-i-work", label: "일하는 방식" },
    { id: "contact", label: "연락" },
  ];

  return (
    <div style={{ fontFamily: "'Noto Sans KR', sans-serif", backgroundColor: "#1E1E28", color: "#F0F0F0", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: "rgba(30,30,40,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#F5C200", letterSpacing: "-0.5px" }}>Se Young Byun</span>
          {/* Desktop nav */}
          <div style={{ display: "flex", gap: 28 }} className="desktop-nav">
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: activeSection === item.id ? 700 : 400, color: activeSection === item.id ? "#F5C200" : "#AAAAAA", transition: "color 0.2s", padding: "4px 0" }}>
                {item.label}
              </button>
            ))}
          </div>
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#F0F0F0", display: "none" }} className="hamburger">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ backgroundColor: "#1E1E28", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 24px 20px" }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: 15, padding: "10px 0", color: activeSection === item.id ? "#F5C200" : "#CCCCCC", fontWeight: activeSection === item.id ? 700 : 400 }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 720 }}>
          <p style={{ fontSize: 13, letterSpacing: 3, color: "#F5C200", marginBottom: 20, textTransform: "uppercase", fontWeight: 600 }}>Product Manager</p>
          <h1 style={{ fontSize: "clamp(40px, 8vw, 76px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 28, color: "#FFFFFF", letterSpacing: "-2px" }}>
            <span style={{ color: "#F5C200" }}>개발자</span>에서<br />PM으로 성장 중
          </h1>
          <p style={{ fontSize: "clamp(15px, 2.5vw, 19px)", color: "#AAAAAA", lineHeight: 1.8, marginBottom: 48 }}>
            9년간 <span style={{ color: "#F5C200", fontWeight: 600 }}>'CS 문의량 감소'</span>를 기준으로<br />개발하고 기획해 왔습니다.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("projects")}
              style={{ backgroundColor: "#F5C200", color: "#1E1E28", border: "none", borderRadius: 40, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              프로젝트 보기
            </button>
            <button onClick={() => scrollTo("contact")}
              style={{ backgroundColor: "transparent", color: "#F0F0F0", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 40, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "border-color 0.2s" }}>
              연락하기
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: "100px 24px", backgroundColor: "#252530" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 12, letterSpacing: 3, color: "#F5C200", marginBottom: 12, textTransform: "uppercase", fontWeight: 600 }}>About Me</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, marginBottom: 48, color: "#FFFFFF" }}>저를 소개합니다</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ backgroundColor: "#1E1E28", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: 11, letterSpacing: 2, color: "#F5C200", marginBottom: 12, textTransform: "uppercase" }}>경력사항</p>
              {[
                { text: "한신대 컴퓨터 공학부 졸업" },
                { text: "(주) 에이엠아이시스템즈" },
                { text: "(주) 크리에이터링크" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ color: "#F5C200", fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#DDDDDD" }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: "#1E1E28", borderRadius: 16, padding: 28, border: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: 11, letterSpacing: 2, color: "#F5C200", marginBottom: 12, textTransform: "uppercase" }}>자격사항</p>
              {["정보처리기사", "SQL 개발자 (SQLD)"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ color: "#F5C200", fontSize: 16 }}>✓</span>
                  <span style={{ fontSize: 14, color: "#DDDDDD" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 24, backgroundColor: "#1E1E28", borderRadius: 16, padding: 28, border: "1px solid rgba(245,194,0,0.2)" }}>
            <p style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 1.9 }}>
              웹디자이너로 시작해 개발자를 거쳐 PM으로 전환 중인 <strong style={{ color: "#FFFFFF" }}>변세영</strong>입니다.<br />
              9년간 일하면서 항상 기준은 하나였습니다 — <strong style={{ color: "#F5C200" }}>"이 기능이 CS 문의를 줄이는가."</strong><br />
              디자인·개발·기획 세 직군을 직접 경험하며 각 팀의 언어로 소통하고 조율해 왔습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 12, letterSpacing: 3, color: "#F5C200", marginBottom: 12, textTransform: "uppercase", fontWeight: 600 }}>Career Timeline</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, marginBottom: 56, color: "#FFFFFF" }}>걸어온 길</h2>
          <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{ position: "absolute", left: 8, top: 8, bottom: 8, width: 2, backgroundColor: "rgba(245,194,0,0.25)" }} />
            {[
              { period: "2017.12 — 현재", company: "(주) 크리에이터링크", role: "웹 개발 + 기획 겸직", desc: "사이트 빌더/커머스 솔루션 개발, 기능 스펙 정의, 요금제 정책 설계, 디자이너·테스터 조율" },
              { period: "2017.05 — 2017.10", company: "내일배움카드 수료", role: "IoT Java Specialist 양성과정", desc: "IoT환경 정보시스템 구축을 위한 Java Specialist 양성" },
              { period: "2015.09 — 2017.04", company: "(주) 에이엠아이시스템즈", role: "웹 디자이너", desc: "UI/UX 디자인, 웹사이트 디자인 및 퍼블리싱" },
              { period: "2012.02 — 2016.02", company: "한신대학교", role: "컴퓨터공학부 (4년제)", desc: "졸업" },
            ].map((item, i) => (
              <div key={i} style={{ position: "relative", marginBottom: 36, paddingLeft: 24 }}>
                <div style={{ position: "absolute", left: -28, top: 6, width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F5C200", border: "3px solid #1E1E28" }} />
                <p style={{ fontSize: 12, color: "#F5C200", marginBottom: 4, fontWeight: 600 }}>{item.period}</p>
                <p style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF", marginBottom: 2 }}>{item.company}</p>
                <p style={{ fontSize: 13, color: "#AAAAAA", marginBottom: 6 }}>{item.role}</p>
                <p style={{ fontSize: 13, color: "#888888", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Skills */}
      <section id="skills" style={{ padding: "100px 24px", backgroundColor: "#252530" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 12, letterSpacing: 3, color: "#F5C200", marginBottom: 12, textTransform: "uppercase", fontWeight: 600 }}>Core Skills</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, marginBottom: 16, color: "#FFFFFF" }}>강점을 만드는 기술과 역량</h2>

          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 13, color: "#888888", marginBottom: 20, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>기술 이해 (Technical)</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {[
                { title: "JavaScript / PHP", desc: "프론트·백엔드 구조를 이해해 개발자의 요구사항을 정확한 단위로 조율" },
                { title: "SQL (SQLD)", desc: "데이터를 직접 조회해 기능 우선순위와 개선 근거를 확인" },
                { title: "웹 빌더 / 커머스 도메인", desc: "요금제, 도메인, 결제 정책 등 솔루션 구조 전반 이해" },
              ].map((item, i) => (
                <div key={i} style={{ backgroundColor: "#1E1E28", borderRadius: 14, padding: "22px 24px", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 10 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: "#888888", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 13, color: "#F5C200", marginBottom: 20, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>PM 역량 (Product)</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              {[
                { title: "정책 설계", desc: "요금제 5단계 × 설정 상태별 기능 접근 매트릭스 설계 경험" },
                { title: "직군 간 조율", desc: "디자이너·테스터·개발 사이에서 일정과 디데이 관리" },
                { title: "CS 기반 우선순위", desc: '"이 기능이 문의를 줄이는가"를 기준으로 한 의사결정' },
              ].map((item, i) => (
                <div key={i} style={{ backgroundColor: "#1E1E28", borderRadius: 14, padding: "22px 24px", border: "1px solid rgba(245,194,0,0.2)" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#F5C200", marginBottom: 10 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: "#888888", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 12, letterSpacing: 3, color: "#F5C200", marginBottom: 12, textTransform: "uppercase", fontWeight: 600 }}>Projects</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, marginBottom: 56, color: "#FFFFFF" }}>주요 프로젝트</h2>

          {/* Project 01 */}
          <div style={{ backgroundColor: "#252530", borderRadius: 20, padding: "36px 40px", marginBottom: 32, border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#1E1E28", backgroundColor: "#F5C200", borderRadius: 4, padding: "3px 10px" }}># 01</span>
              <span style={{ fontSize: 11, color: "#4CAF50", backgroundColor: "rgba(76,175,80,0.15)", borderRadius: 4, padding: "3px 10px", fontWeight: 600 }}>2025.09 라이브</span>
            </div>
            <h3 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: "#FFFFFF", marginBottom: 8 }}>퀵메뉴 셀프서비스 기능 출시</h3>
            <p style={{ fontSize: 14, color: "#F5C200", marginBottom: 28, fontWeight: 600 }}>개발팀 수동 작업을 제품 기능으로 전환</p>
            <div style={{ display: "grid", gap: 16 }}>
              {[
                { label: "배경", text: "퀵메뉴·채팅앱 버튼 설치 요청마다 개발자가 스크립트를 수동 삽입 → CS 접수·대기 반복" },
                { label: "역할", text: "기능 스펙 정의, 레거시(모바일 전용 버튼 등) 지원 종료·충돌 방지 정책 수립" },
                { label: "설계", text: "PC/모바일 개별 설정, 최대 10개, 이미지형 지원, 비즈니스 요금제 전용(수익화 연계)" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#F5C200", backgroundColor: "rgba(245,194,0,0.12)", borderRadius: 4, padding: "3px 10px", whiteSpace: "nowrap", marginTop: 2 }}>{item.label}</span>
                  <p style={{ fontSize: 14, color: "#CCCCCC", lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, padding: "20px 24px", backgroundColor: "#1E1E28", borderRadius: 12, borderLeft: "3px solid #F5C200" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#AAAAAA", marginBottom: 10 }}>핵심 기여</p>
              {[
                "사용자가 직접 아이콘 등록·링크 연결하는 셀프서비스 구조로 전환",
                "출시 후 관련 수동 작업·CS 문의 0건 — 개발팀 반복 운영 업무 제거",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: "#F5C200", marginTop: 2 }}>✓</span>
                  <p style={{ fontSize: 14, color: "#FFFFFF", lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Project 02 */}
          <div style={{ backgroundColor: "#252530", borderRadius: 20, padding: "36px 40px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#1E1E28", backgroundColor: "#F5C200", borderRadius: 4, padding: "3px 10px" }}># 02</span>
              <span style={{ fontSize: 11, color: "#64B5F6", backgroundColor: "rgba(100,181,246,0.15)", borderRadius: 4, padding: "3px 10px", fontWeight: 600 }}>2026.06 기획</span>
            </div>
            <h3 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: "#FFFFFF", marginBottom: 8 }}>도메인 관리 허브 신규 기획</h3>
            <p style={{ fontSize: 14, color: "#F5C200", marginBottom: 28, fontWeight: 600 }}>분산된 도메인 기능을 사용자 목적 기준으로 재설계</p>
            <div style={{ display: "grid", gap: 16, marginBottom: 28 }}>
              {[
                { label: "배경", text: "기존 도메인 구매 기능 부재 + 연결/기관이전 혼재로 사용자 문의 반복 발생" },
                { label: "역할", text: "UX 원칙 수립, 용어 정의, 케이스별 플로우 설계, MVP 1차/2차 범위 분리" },
                { label: "설계", text: "도메인 없는 사용자도 허브를 먼저 보여 목적을 스스로 선택하게 하는 구조" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#F5C200", backgroundColor: "rgba(245,194,0,0.12)", borderRadius: 4, padding: "3px 10px", whiteSpace: "nowrap", marginTop: 2 }}>{item.label}</span>
                  <p style={{ fontSize: 14, color: "#CCCCCC", lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "20px 24px", backgroundColor: "#1E1E28", borderRadius: 12, borderLeft: "3px solid #F5C200" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#AAAAAA", marginBottom: 10 }}>핵심 기여</p>
              {[
                '기존 용어를 사용자 관점으로 재정의 (예: "외부 도메인 연결" → "보유 도메인 연결")',
                "구매/연결/관리 3가지 목적별 CTA 우선순위 설계",
                "도메인 전문 업체와 웹빌더 동종업체를 구분해 가격을 비교 분석하고, 확장자별 권장 판매가 정책 수립",
                "v1 초안 → v3 최신까지 버전 관리하며 PRD 고도화",
                "ChatGPT로 기획안 구체화 → Codex로 직접 인터랙티브 PRD 구현",
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: "#F5C200", marginTop: 2 }}>✓</span>
                  <p style={{ fontSize: 14, color: "#FFFFFF", lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
            </div>
            <a
              href="https://erinby.github.io/domain-project/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginTop: 20,
                backgroundColor: "transparent", color: "#F5C200", border: "1.5px solid rgba(245,194,0,0.4)",
                borderRadius: 40, padding: "10px 22px", fontSize: 13, fontWeight: 700, textDecoration: "none",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(245,194,0,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              📎 PRD 문서 전문 보기
            </a>
          </div>
        </div>
      </section>

      {/* How I Work */}
      <section id="how-i-work" style={{ padding: "100px 24px", backgroundColor: "#252530" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 12, letterSpacing: 3, color: "#F5C200", marginBottom: 12, textTransform: "uppercase", fontWeight: 600 }}>How I Work</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, marginBottom: 8, color: "#FFFFFF" }}>CS가 줄어야 좋은 제품이다</h2>
          <p style={{ fontSize: 15, color: "#888888", marginBottom: 56, lineHeight: 1.8 }}>
            9년간 개발하면서 항상 기준은 하나였습니다. <span style={{ color: "#F5C200", fontWeight: 600 }}>"이 기능이 CS 문의를 줄이는가."</span><br />
            복잡하고 부담되는 작업이라도 솔루션에 꼭 필요한 기능이라면 직접 마감일을 제시하고 출시까지 진행했습니다.<br />
            디자이너 · 개발자 · 기획, 세 역할을 직접 경험하며 각 팀의 언어로 소통하고 조율해 왔습니다.
          </p>

          {/* Flow */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 56, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              "문의·요청 패턴에서\n문제 발견",
              "정책·예외케이스\n직접 정의",
              "디데이 제시하고\n출시까지 완료",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  backgroundColor: i === 2 ? "#F5C200" : i === 1 ? "#3D4A5C" : "#2E3545",
                  color: i === 2 ? "#1E1E28" : "#FFFFFF",
                  borderRadius: 40, padding: "16px 24px", fontSize: 13, fontWeight: 700,
                  textAlign: "center", lineHeight: 1.5, whiteSpace: "pre-line", minWidth: 140
                }}>
                  {text}
                </div>
                {i < 2 && <span style={{ color: "#F5C200", fontSize: 18, fontWeight: 700 }}>»</span>}
              </div>
            ))}
          </div>

          <div style={{ backgroundColor: "#1E1E28", borderRadius: 16, padding: "28px 32px", border: "1px solid rgba(245,194,0,0.2)", textAlign: "center" }}>
            <p style={{ fontSize: "clamp(15px, 2.5vw, 18px)", color: "#FFFFFF", lineHeight: 1.9, fontStyle: "italic" }}>
              "개발자의 손을 거치던 일을 제품이 스스로 하게 만드는 것,<br />
              <span style={{ color: "#F5C200", fontWeight: 700 }}>그게 제가 생각하는 PM의 일입니다.</span>"
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 12, letterSpacing: 3, color: "#F5C200", marginBottom: 12, textTransform: "uppercase", fontWeight: 600 }}>Contact</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, marginBottom: 16, color: "#FFFFFF" }}>경청해 주셔서<br />감사합니다.</h2>
          <p style={{ fontSize: 15, color: "#888888", marginBottom: 48, lineHeight: 1.8 }}>
            개발자의 시각으로 제품을 기획하는 PM —<br />
            9년간 CS를 줄이는 제품을 목표로 개발하고 기획해 왔습니다.<br />
            함께 더 좋은 제품을 만들어 갈 기회를 기다리고 있습니다.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:se.young492@gmail.com"
              style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "#F5C200", color: "#1E1E28", borderRadius: 40, padding: "14px 28px", fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              <Mail size={16} /> se.young492@gmail.com
            </a>
            <a href="https://github.com/ErinBY" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "transparent", color: "#F0F0F0", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 40, padding: "14px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              <Github size={16} /> GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#13131A", padding: "24px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#555555" }}>© 2026 변세영 (Se young Byun). All rights reserved.</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </div>
  );
}
