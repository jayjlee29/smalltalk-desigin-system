import React from "react";

// 접근성: label을 htmlFor/id로 input과 연결하고, label이 없으면 placeholder를
// aria-label로 사용. 에러는 aria-invalid + aria-describedby로 알린다.
export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  label,
  autoComplete,
  required = false,
  compact = false,
}) {
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
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        aria-label={!label ? placeholder : undefined}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errId}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          fontSize: 14,
          padding: compact ? "6px 12px" : "10px 12px",
          borderRadius: "var(--radius-lg)",
          border: `1px solid ${error ? "var(--border-error)" : "var(--gray-200)"}`,
          outline: "none",
          boxShadow: focused ? "0 0 0 2px var(--blue-500)" : "none",
          color: "var(--gray-900)",
          transition: "var(--transition-default)",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <p id={errId} style={{ fontSize: 12, color: "var(--red-500)", marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}
