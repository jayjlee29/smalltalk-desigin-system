import React from "react";

export function Link({ href = "#", children, external = false, muted = false }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        color: muted ? "var(--gray-500)" : "var(--text-link)",
        textDecoration: "none",
        cursor: "pointer",
      }}
    >
      {children}
      {external && <span style={{ fontSize: 11, marginLeft: 2 }}>↗</span>}
    </a>
  );
}
