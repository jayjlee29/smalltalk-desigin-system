import React from "react";

const TONES = {
  blue: { background: "var(--blue-50)", color: "var(--blue-600)" },
  gray: { background: "var(--gray-100)", color: "var(--gray-500)" },
  green: { background: "var(--green-100)", color: "var(--green-700)" },
  purple: { background: "var(--purple-100)", color: "var(--purple-700)" },
  orange: { background: "var(--orange-100)", color: "var(--orange-700)" },
};

export function Badge({ tone = "gray", pill = true, children }) {
  const t = TONES[tone] ?? TONES.gray;
  return (
    <span
      style={{
        fontFamily: "var(--font-sans)",
        display: "inline-block",
        fontSize: 12,
        fontWeight: 500,
        padding: pill ? "4px 10px" : "2px 6px",
        borderRadius: pill ? "var(--radius-full)" : "var(--radius-default)",
        ...t,
      }}
    >
      {children}
    </span>
  );
}
