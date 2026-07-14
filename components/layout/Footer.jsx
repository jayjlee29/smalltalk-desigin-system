import React from "react";

// 좌우 패딩을 컴포넌트에 내장(clamp)해, Container 없이 전체 폭에 놓아도 콘텐츠가
// 화면 끝에 붙지 않는다. maxWidth를 주면 내부 콘텐츠를 그 폭으로 중앙 정렬해
// 본문(같은 max-width)과 좌우 정렬이 맞는다. 세로/가로 여백은 space 토큰 사용.
export function Footer({ brand = "Smalltalk Community", links = [], note, maxWidth }) {
  return (
    <footer style={{ borderTop: "1px solid var(--gray-200)", marginTop: "var(--space-8)", padding: "var(--space-6) clamp(16px, 4vw, var(--space-10))", fontFamily: "var(--font-sans)" }}>
      <div style={{ maxWidth: maxWidth ?? "none", margin: maxWidth ? "0 auto" : undefined }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--gray-700)" }}>{brand}</span>
          <nav style={{ display: "flex", gap: 16 }}>
            {links.map((l, i) => (
              <a key={i} href={l.href || "#"} style={{ fontSize: 13, color: "var(--gray-500)", textDecoration: "none" }}>{l.label}</a>
            ))}
          </nav>
        </div>
        {note && <p style={{ margin: "12px 0 0", fontSize: 12, color: "var(--gray-400)" }}>{note}</p>}
      </div>
    </footer>
  );
}
