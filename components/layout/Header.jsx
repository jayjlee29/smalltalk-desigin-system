import React from "react";

// Responsive: the inner row / nav use tokens/layout.css classes so gaps tighten
// and the nav scrolls horizontally rather than overflowing on small screens.
export function Header({ brand = "Smalltalk Community", links = [], right }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        height: "var(--header-height)",
        background: "var(--white)",
        borderBottom: "1px solid var(--gray-200)",
        display: "flex",
        alignItems: "center",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        className="ds-header__inner"
        style={{ width: "100%", maxWidth: "var(--content-max-width)", margin: "0 auto", padding: "0 16px", boxSizing: "border-box" }}
      >
        <span style={{ fontWeight: 700, fontSize: 16, color: "var(--gray-900)", whiteSpace: "nowrap" }}>{brand}</span>
        <nav className="ds-header__nav">
          {links.map((l, i) => (
            <a
              key={i}
              href={l.href || "#"}
              style={{
                fontSize: 14,
                textDecoration: "none",
                whiteSpace: "nowrap",
                color: l.active ? "var(--blue-600)" : "var(--gray-600)",
                fontWeight: l.active ? 600 : 500,
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
        {right && <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>{right}</div>}
      </div>
    </header>
  );
}
