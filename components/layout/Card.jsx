import React from "react";

export function Card({ elevated = false, hoverable = false, gradient = false, padding = 20, children }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => hoverable && setHover(true)}
      onMouseLeave={() => hoverable && setHover(false)}
      style={{
        fontFamily: "var(--font-sans)",
        border: `1px solid ${hover && hoverable ? "var(--blue-400)" : "var(--gray-200)"}`,
        borderRadius: elevated ? "var(--radius-xl)" : "var(--radius-lg)",
        padding,
        background: gradient
          ? "linear-gradient(to bottom right, var(--gray-50), var(--white))"
          : "var(--white)",
        boxShadow: hover && hoverable ? "var(--shadow-sm)" : "none",
        transition: "var(--transition-default)",
      }}
    >
      {children}
    </div>
  );
}
