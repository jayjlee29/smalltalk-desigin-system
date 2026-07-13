import React from "react";

export function EmptyState({ title, description, action, icon }) {
  return (
    <div style={{ fontFamily: "var(--font-sans)", textAlign: "center", padding: "40px 24px" }}>
      {icon && <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.7 }}>{icon}</div>}
      <div style={{ fontSize: 14, color: "var(--gray-500)", fontWeight: 500 }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: "var(--gray-400)", marginTop: 4, lineHeight: 1.5 }}>{description}</div>}
      {action && <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>{action}</div>}
    </div>
  );
}
