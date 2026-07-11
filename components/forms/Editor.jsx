import React from "react";
import { Textarea } from "./Textarea.jsx";

// 새글 본문 에디터. 앱이 쓰는 3가지 외부 에디터 모듈의 편집 표면/툴바를 DS 토큰으로
// 표현한 스펙 컴포넌트 (실제 TipTap/Novel 라이브러리는 앱에서 연동; DS는 UI 스펙 제공):
//   basic  — 기본 Textarea (상호작용 가능)
//   tiptap — 리치 텍스트 툴바 + 편집 영역
//   novel  — Notion 스타일 슬래시 커맨드 + AI + 버블 메뉴
const TB_BTN = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  minWidth: 28, height: 28, padding: "0 8px", border: "none", background: "none",
  borderRadius: "var(--radius-default)", cursor: "pointer", fontSize: 13,
  color: "var(--gray-600)", fontFamily: "var(--font-sans)",
};

function Toolbar({ items }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", padding: "6px 8px", borderBottom: "1px solid var(--gray-200)", background: "var(--gray-50)" }}>
      {items.map((it, i) =>
        it === "|" ? (
          <span key={i} style={{ width: 1, height: 18, background: "var(--gray-200)", margin: "0 4px" }} />
        ) : (
          <button key={i} style={{ ...TB_BTN, fontWeight: it.b ? 700 : 500, fontStyle: it.i ? "italic" : "normal", textDecoration: it.u ? "underline" : "none" }}>
            {it.label}
          </button>
        )
      )}
    </div>
  );
}

function RichSample() {
  return (
    <div style={{ padding: 16, fontSize: 14, lineHeight: 1.7, color: "var(--gray-900)", minHeight: 130 }}>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>오늘 장 마감 후기</div>
      <p style={{ margin: "0 0 8px" }}>코스피 <strong>강하게 마감</strong>했네요. 보유 종목 대부분 <em>플러스 전환</em>했습니다.</p>
      <ul style={{ margin: "0 0 8px", paddingLeft: 20 }}>
        <li>삼성전자 +12.4%</li>
        <li>카카오 -4.1%</li>
      </ul>
      <blockquote style={{ margin: 0, paddingLeft: 12, borderLeft: "3px solid var(--blue-400)", color: "var(--gray-600)" }}>다들 좋은 하루 되세요.</blockquote>
    </div>
  );
}

export function Editor({ variant = "basic", placeholder = "내용을 입력하세요", value, onChange, rows = 8 }) {
  if (variant === "basic") {
    return <Textarea rows={rows} placeholder={placeholder} value={value} onChange={onChange} />;
  }

  if (variant === "tiptap") {
    return (
      <div style={{ fontFamily: "var(--font-sans)", border: "1px solid var(--gray-200)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <Toolbar items={[{ label: "B", b: true }, { label: "I", i: true }, { label: "U", u: true }, "|", { label: "H1" }, { label: "H2" }, "|", { label: "목록" }, { label: "번호" }, { label: "인용" }, "|", { label: "코드" }, { label: "링크" }]} />
        <RichSample />
      </div>
    );
  }

  // novel — Notion 스타일
  return (
    <div style={{ fontFamily: "var(--font-sans)", border: "1px solid var(--gray-200)", borderRadius: "var(--radius-lg)", overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderBottom: "1px solid var(--gray-200)", background: "var(--gray-50)" }}>
        <span style={{ fontSize: 12, color: "var(--gray-400)" }}>“/” 를 입력해 블록 삽입 · 드래그로 서식 메뉴</span>
        <button style={{ ...TB_BTN, color: "var(--blue-600)", fontWeight: 600 }}>AI 자동완성</button>
      </div>
      <RichSample />
      {/* 드래그 시 뜨는 버블 메뉴 표현 */}
      <div style={{ margin: "0 16px 16px", display: "inline-flex", gap: 2, padding: 4, background: "var(--gray-900)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)" }}>
        {["B", "I", "U", "링크", "AI"].map((l, i) => (
          <span key={i} style={{ color: "var(--white)", fontSize: 12, padding: "4px 8px", borderRadius: 6, fontWeight: l === "B" ? 700 : 500 }}>{l}</span>
        ))}
      </div>
    </div>
  );
}
