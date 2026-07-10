import React from "react";

export function Pagination({ page, totalPages, onChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 4, fontFamily: "var(--font-sans)" }}>
      {pages.map((p) => {
        const active = p === page;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-lg)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "var(--transition-default)",
              border: active ? "1px solid transparent" : "1px solid var(--gray-200)",
              background: active ? "var(--blue-600)" : "var(--white)",
              color: active ? "var(--white)" : "var(--gray-600)",
            }}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}
