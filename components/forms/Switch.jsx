import React from "react";

// 접근성: role="switch" 버튼이라 Tab 포커스 + Space/Enter 토글이 동작하고,
// aria-checked로 상태를 알린다. .ds-focus로 키보드 포커스 링 표시.
export function Switch({ checked = false, onChange, label, disabled = false }) {
  const toggle = () => !disabled && onChange && onChange(!checked);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--gray-700)", opacity: disabled ? 0.5 : 1 }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={typeof label === "string" ? label : undefined}
        disabled={disabled}
        onClick={toggle}
        className="ds-focus"
        style={{
          position: "relative", width: 38, height: 22, flexShrink: 0, padding: 0, border: "none",
          borderRadius: "var(--radius-full)", background: checked ? "var(--blue-600)" : "var(--gray-300)",
          cursor: disabled ? "default" : "pointer", transition: "var(--transition-default)",
        }}
      >
        <span style={{ position: "absolute", top: 2, left: checked ? 18 : 2, width: 18, height: 18, borderRadius: "var(--radius-full)", background: "var(--white)", boxShadow: "var(--shadow-sm)", transition: "var(--transition-default)" }} />
      </button>
      {label && <span onClick={toggle} style={{ cursor: disabled ? "default" : "pointer" }}>{label}</span>}
    </span>
  );
}
