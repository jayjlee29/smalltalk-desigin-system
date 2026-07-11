import React from "react";

export function Footer({ brand = "Smalltalk Community", links = [], note }) {
  return (
    <footer style={{ borderTop: "1px solid var(--gray-200)", marginTop: 32, padding: "24px 0", fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--gray-700)" }}>{brand}</span>
        <nav style={{ display: "flex", gap: 16 }}>
          {links.map((l, i) => (
            <a key={i} href={l.href || "#"} style={{ fontSize: 13, color: "var(--gray-500)", textDecoration: "none" }}>{l.label}</a>
          ))}
        </nav>
      </div>
      {note && <p style={{ margin: "12px 0 0", fontSize: 12, color: "var(--gray-400)" }}>{note}</p>}
    </footer>
  );
}
