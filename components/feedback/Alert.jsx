import React from "react";

const TONES = {
  info: { bg: "var(--blue-50)", border: "var(--blue-100)", fg: "var(--blue-700)" },
  success: { bg: "var(--green-100)", border: "var(--green-100)", fg: "var(--green-700)" },
  warning: { bg: "var(--orange-100)", border: "var(--orange-100)", fg: "var(--orange-700)" },
  error: { bg: "var(--red-50)", border: "var(--red-100)", fg: "var(--red-600)" },
};

export function Alert({ tone = "info", title, children, onClose }) {
  const t = TONES[tone] ?? TONES.info;
  return (
    <div
      role={tone === "error" || tone === "warning" ? "alert" : "status"}
      style={{
        fontFamily: "var(--font-sans)",
        display: "flex",
        gap: 10,
        padding: "12px 14px",
        borderRadius: "var(--radius-lg)",
        background: t.bg,
        border: `1px solid ${t.border}`,
        fontSize: 14,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontWeight: 600, color: t.fg, marginBottom: children ? 4 : 0 }}>{title}</div>}
        {children && <div style={{ color: "var(--gray-700)", lineHeight: 1.5 }}>{children}</div>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="닫기" className="ds-focus" style={{ border: "none", background: "none", cursor: "pointer", color: t.fg, fontSize: 16, lineHeight: 1, padding: 0, flexShrink: 0, borderRadius: "var(--radius-default)" }}>
          ×
        </button>
      )}
    </div>
  );
}
