import React from "react";

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
  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {label && (
        <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--gray-700)", marginBottom: 6 }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
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
        <p style={{ fontSize: 12, color: "var(--red-500)", marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}
