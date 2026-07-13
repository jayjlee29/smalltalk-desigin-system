import React from "react";

const PALETTE = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)",
  "var(--chart-5)", "var(--chart-6)", "var(--chart-7)", "var(--chart-8)",
];

// Self-contained donut/pie chart (SVG stroke-dasharray, no external lib) with
// a legend. Uses the DS categorical palette tokens.
export function DonutChart({ data = [], size = 140, thickness = 20 }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  let offset = 0;
  const segs = data.map((d, i) => {
    const frac = d.value / total;
    const len = frac * circ;
    const seg = { color: d.color || PALETTE[i % PALETTE.length], dash: len, gap: circ - len, off: -offset, label: d.label, pct: Math.round(frac * 100) };
    offset += len;
    return seg;
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "var(--font-sans)", flexWrap: "wrap" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          {segs.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={s.off} />
          ))}
        </g>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 120 }}>
        {segs.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--gray-700)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{s.label}</span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--gray-500)" }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
