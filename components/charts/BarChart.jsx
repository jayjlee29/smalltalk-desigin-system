import React from "react";

// Self-contained vertical bar chart (no external chart lib). Uses the DS
// categorical palette tokens (--chart-*).
export function BarChart({ data = [], height = 160, color = "var(--chart-1)", showValues = false }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barArea = height - 24;
  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 0 }}>
            {showValues && <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--gray-500)" }}>{d.value}</span>}
            <div
              title={String(d.value)}
              style={{
                width: "100%",
                maxWidth: 44,
                height: Math.round((d.value / max) * barArea) + "px",
                background: d.color || color,
                borderRadius: "6px 6px 0 0",
                transition: "var(--transition-default)",
              }}
            />
            <span style={{ fontSize: 11, color: "var(--gray-400)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
