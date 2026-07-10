import React from "react";

const VARIANT_STYLES = {
  primary: {
    background: "var(--blue-600)",
    color: "var(--white)",
    border: "1px solid transparent",
  },
  secondary: {
    background: "var(--white)",
    color: "var(--gray-700)",
    border: "1px solid var(--gray-200)",
  },
  danger: {
    background: "var(--red-500)",
    color: "var(--white)",
    border: "1px solid transparent",
  },
  ghost: {
    background: "transparent",
    color: "var(--gray-500)",
    border: "1px solid transparent",
  },
};

const HOVER_BG = {
  primary: "var(--blue-700)",
  secondary: "var(--gray-50)",
  danger: "var(--red-600)",
  ghost: "var(--gray-50)",
};

const SIZE_STYLES = {
  sm: { fontSize: 12, padding: "6px 10px" },
  md: { fontSize: 14, padding: "8px 14px" },
  lg: { fontSize: 14, padding: "10px 16px", width: "100%" },
};

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  onClick,
  type = "button",
}) {
  const [hover, setHover] = React.useState(false);
  const base = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const size_ = SIZE_STYLES[size] ?? SIZE_STYLES.md;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        borderRadius: "var(--radius-lg)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "var(--transition-default)",
        ...base,
        ...size_,
        background: hover && !disabled ? HOVER_BG[variant] : base.background,
      }}
    >
      {children}
    </button>
  );
}
