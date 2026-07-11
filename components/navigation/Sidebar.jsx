import React from "react";

// Standalone vertical navigation menu (side menu). Use inside SidebarLayout or
// on its own. Items can be links (label/href/active/count/icon) or section
// headings (section: true).
export function Sidebar({ items = [], header }) {
  return (
    <nav
      style={{
        fontFamily: "var(--font-sans)",
        border: "1px solid var(--gray-200)",
        borderRadius: "var(--radius-xl)",
        background: "var(--white)",
        padding: 8,
        width: "100%",
      }}
    >
      {header && (
        <div style={{ fontSize: 12, color: "var(--gray-400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".03em", padding: "6px 12px" }}>
          {header}
        </div>
      )}
      {items.map((it, i) =>
        it.section ? (
          <div key={i} style={{ fontSize: 11, color: "var(--gray-400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".03em", padding: "12px 12px 4px" }}>
            {it.label}
          </div>
        ) : (
          <a
            key={i}
            href={it.href || "#"}
            aria-current={it.active ? "page" : undefined}
            className="ds-focus"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              textDecoration: "none",
              fontSize: 14,
              padding: "8px 12px",
              borderRadius: "var(--radius-lg)",
              color: it.active ? "var(--blue-600)" : "var(--gray-600)",
              background: it.active ? "var(--blue-50)" : "transparent",
              fontWeight: it.active ? 600 : 500,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              {it.icon != null && <span style={{ display: "inline-flex" }}>{it.icon}</span>}
              {it.label}
            </span>
            {it.count != null && <span style={{ fontSize: 12, color: it.active ? "var(--blue-600)" : "var(--gray-400)" }}>{it.count}</span>}
          </a>
        )
      )}
    </nav>
  );
}
