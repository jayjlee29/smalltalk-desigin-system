import React from "react";

export function Section({ title, description, actions, children }) {
  return (
    <section style={{ fontFamily: "var(--font-sans)" }}>
      {(title || actions) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
          <div style={{ minWidth: 0 }}>
            {title && <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--gray-900)" }}>{title}</h2>}
            {description && <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--gray-500)" }}>{description}</p>}
          </div>
          {actions && <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
