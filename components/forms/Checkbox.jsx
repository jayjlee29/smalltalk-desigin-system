import React from "react";

// 접근성: 실제 <input>이 포커스를 받아 Space 토글이 동작하고, 키보드 포커스 시
// tokens/a11y.css의 `.ds-check-input:focus-visible + .ds-check-box` 규칙으로
// 시각 박스에 포커스 링이 표시된다(input이 박스 앞에 와야 인접 선택자가 동작).
export function Checkbox({ checked = false, onChange, label, disabled = false }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--gray-700)", cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1 }}>
      <input type="checkbox" className="ds-check-input" checked={checked} onChange={onChange} disabled={disabled} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <span
        className="ds-check-box"
        aria-hidden="true"
        style={{ width: 18, height: 18, borderRadius: "var(--radius-default)", border: `1px solid ${checked ? "var(--blue-600)" : "var(--gray-300)"}`, background: checked ? "var(--blue-600)" : "var(--white)", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "var(--transition-default)", flexShrink: 0 }}
      >
        {checked && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      {label}
    </label>
  );
}
