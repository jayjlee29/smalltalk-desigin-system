import React from "react";

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        fontFamily: "var(--font-sans)",
        padding: "4px 0 16px",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "var(--gray-900)" }}>{title}</h1>
        {subtitle && <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--gray-500)" }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>{actions}</div>}
    </div>
  );
}
