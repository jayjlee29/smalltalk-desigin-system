import React from "react";

// 접근성: role="radiogroup" + 실제 radio input(같은 name)으로 키보드 화살표
// 이동/선택이 브라우저 기본 동작으로 되고, 포커스 시 a11y.css 규칙
// `.ds-check-input:focus-visible + .ds-radio-box`로 원형에 포커스 링 표시.
export function RadioGroup({ value, onChange, options = [], name = "radio", direction = "vertical" }) {
  return (
    <div role="radiogroup" style={{ display: "flex", flexDirection: direction === "horizontal" ? "row" : "column", gap: direction === "horizontal" ? 16 : 10, fontFamily: "var(--font-sans)" }}>
      {options.map((o) => {
        const sel = o.value === value;
        return (
          <label key={o.value} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--gray-700)", cursor: "pointer" }}>
            <input type="radio" name={name} className="ds-check-input" checked={sel} onChange={() => onChange && onChange(o.value)} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
            <span
              className="ds-radio-box"
              aria-hidden="true"
              style={{ width: 18, height: 18, borderRadius: "var(--radius-full)", border: `1px solid ${sel ? "var(--blue-600)" : "var(--gray-300)"}`, display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "var(--transition-default)", flexShrink: 0 }}
            >
              {sel && <span style={{ width: 8, height: 8, borderRadius: "var(--radius-full)", background: "var(--blue-600)" }} />}
            </span>
            {o.label}
          </label>
        );
      })}
    </div>
  );
}
