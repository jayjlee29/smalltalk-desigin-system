import React from "react";

export function Divider({ orientation = "horizontal", label, spacing = 16 }) {
  if (orientation === "vertical") {
    return <span style={{ display: "inline-block", width: 1, alignSelf: "stretch", background: "var(--gray-200)", margin: `0 ${spacing}px` }} />;
  }
  if (label) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: `${spacing}px 0`, fontFamily: "var(--font-sans)" }}>
        <span style={{ flex: 1, height: 1, background: "var(--gray-200)" }} />
        <span style={{ fontSize: 12, color: "var(--gray-400)" }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: "var(--gray-200)" }} />
      </div>
    );
  }
  return <div style={{ height: 1, background: "var(--gray-200)", margin: `${spacing}px 0` }} />;
}
