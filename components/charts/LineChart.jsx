import React from "react";

// Self-contained line/area trend chart (SVG, no external lib). Uses the DS
// palette tokens. preserveAspectRatio="none" stretches to the container; the
// stroke stays crisp via vectorEffect="non-scaling-stroke".
export function LineChart({ data = [], height = 160, color = "var(--chart-1)", area = true }) {
  const W = 100, H = 100;
  const vals = data.map((d) => d.value);
  const max = Math.max(...vals, 0);
  const min = Math.min(...vals, 0);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = data.length === 1 ? W / 2 : (i / (data.length - 1)) * W;
    const y = H - ((d.value - min) / range) * H;
    return `${x},${y}`;
  });
  const line = pts.join(" ");
  const areaPts = `0,${H} ${line} ${W},${H}`;
  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height, display: "block", overflow: "visible" }}>
        {area && <polygon points={areaPts} fill={color} opacity="0.12" />}
        <polyline points={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {data.map((d, i) => (
          <span key={i} style={{ fontSize: 11, color: "var(--gray-400)", fontFamily: "var(--font-mono)" }}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
