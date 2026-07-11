import React from "react";

export function Select({ label, value, onChange, options = [], placeholder, error, disabled = false }) {
  const [focused, setFocused] = React.useState(false);
  const id = React.useId();
  const errId = error ? `${id}-err` : undefined;
  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {label && (
        <label htmlFor={id} style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--gray-700)", marginBottom: 6 }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <select
          id={id}
          value={value ?? ""}
          onChange={onChange}
          disabled={disabled}
          aria-label={!label ? placeholder : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errId}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            fontSize: 14,
            fontFamily: "var(--font-sans)",
            padding: "10px 36px 10px 12px",
            borderRadius: "var(--radius-lg)",
            border: `1px solid ${error ? "var(--border-error)" : "var(--gray-200)"}`,
            outline: "none",
            appearance: "none",
            background: disabled ? "var(--gray-50)" : "var(--white)",
            color: value ? "var(--gray-900)" : "var(--gray-400)",
            boxShadow: focused ? "0 0 0 2px var(--blue-500)" : "none",
            cursor: disabled ? "default" : "pointer",
            transition: "var(--transition-default)",
            boxSizing: "border-box",
          }}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--gray-400)", fontSize: 11 }}>
          ▼
        </span>
      </div>
      {error && <p id={errId} style={{ fontSize: 12, color: "var(--red-500)", marginTop: 4 }}>{error}</p>}
    </div>
  );
}
