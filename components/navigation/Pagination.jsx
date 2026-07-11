import React from "react";

// 접근성: <nav aria-label>, 각 버튼 aria-label(N 페이지) + 현재 페이지 aria-current,
// .ds-focus 포커스 링.
export function Pagination({ page, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav aria-label="페이지네이션" style={{ display: "flex", justifyContent: "center", gap: 4, fontFamily: "var(--font-sans)" }}>
      {pages.map((p) => {
        const active = p === page;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-label={`${p} 페이지`}
            aria-current={active ? "page" : undefined}
            className="ds-focus"
            style={{
              width: 36, height: 36, borderRadius: "var(--radius-lg)", fontSize: 14, fontWeight: 500, cursor: "pointer",
              transition: "var(--transition-default)", border: active ? "1px solid transparent" : "1px solid var(--gray-200)",
              background: active ? "var(--blue-600)" : "var(--white)", color: active ? "var(--white)" : "var(--gray-600)",
            }}
          >
            {p}
          </button>
        );
      })}
    </nav>
  );
}
