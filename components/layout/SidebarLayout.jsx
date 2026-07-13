import React from "react";

// Responsive: the sidebar width is passed via a CSS custom property and the
// grid/nav direction live in tokens/layout.css, which stacks .ds-sidebar-layout
// (sidebar on top, nav as a wrapping row) on small screens.
export function SidebarLayout({ nav = [], title, sidebarWidth = 220, children }) {
  return (
    <div
      className="ds-sidebar-layout"
      style={{ "--ds-sidebar-w": typeof sidebarWidth === "number" ? sidebarWidth + "px" : sidebarWidth, fontFamily: "var(--font-sans)" }}
    >
      <aside
        className="ds-sidebar-layout__aside"
        style={{ border: "1px solid var(--gray-200)", borderRadius: "var(--radius-xl)", background: "var(--white)", padding: 12 }}
      >
        {title && (
          <div style={{ fontSize: 12, color: "var(--gray-400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".03em", padding: "4px 10px 8px" }}>
            {title}
          </div>
        )}
        <nav className="ds-sidebar-layout__nav">
          {nav.map((it, i) => (
            <a
              key={i}
              href={it.href || "#"}
              aria-current={it.active ? "page" : undefined}
              className="ds-focus"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                fontSize: 14,
                padding: "8px 10px",
                borderRadius: "var(--radius-lg)",
                color: it.active ? "var(--blue-600)" : "var(--gray-600)",
                background: it.active ? "var(--blue-50)" : "transparent",
                fontWeight: it.active ? 600 : 500,
              }}
            >
              <span>{it.label}</span>
              {it.count != null && <span style={{ fontSize: 12, color: "var(--gray-400)" }}>{it.count}</span>}
            </a>
          ))}
        </nav>
      </aside>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}
