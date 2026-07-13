import React from "react";

const TONES = {
  gray: { bg: "var(--gray-100)", fg: "var(--gray-600)" },
  blue: { bg: "var(--blue-50)", fg: "var(--blue-600)" },
};

export function Tag({ children, onRemove, tone = "gray" }) {
  const c = TONES[tone] ?? TONES.gray;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        padding: "3px 8px",
        borderRadius: "var(--radius-default)",
        background: c.bg,
        color: c.fg,
      }}
    >
      {children}
      {onRemove && (
        <button onClick={onRemove} aria-label="태그 제거" className="ds-focus" style={{ border: "none", background: "none", cursor: "pointer", color: c.fg, padding: 0, fontSize: 13, lineHeight: 1, opacity: 0.7, borderRadius: "var(--radius-default)" }}>
          ×
        </button>
      )}
    </span>
  );
}
