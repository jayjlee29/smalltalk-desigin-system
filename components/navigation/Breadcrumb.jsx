import React from "react";

export function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="브레드크럼" style={{ fontFamily: "var(--font-sans)", fontSize: 14, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {last ? (
              <span aria-current="page" style={{ color: "var(--gray-900)", fontWeight: 500 }}>{it.label}</span>
            ) : (
              <a href={it.href || "#"} style={{ color: "var(--text-link)", textDecoration: "none" }}>{it.label}</a>
            )}
            {!last && <span style={{ color: "var(--gray-300)" }}>/</span>}
          </span>
        );
      })}
    </nav>
  );
}
