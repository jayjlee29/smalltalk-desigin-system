import React from "react";

const TONES = ["var(--blue-600)", "var(--green-600)", "var(--purple-700)", "var(--orange-700)", "var(--red-500)"];

export function Avatar({ name = "", src, size = 36 }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const bg = TONES[(name.charCodeAt(0) || 0) % TONES.length];
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: "var(--radius-full)", objectFit: "cover", display: "inline-block" }}
      />
    );
  }
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "var(--radius-full)",
        background: bg,
        color: "var(--white)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
        fontSize: Math.round(size * 0.42),
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initial}
    </span>
  );
}
