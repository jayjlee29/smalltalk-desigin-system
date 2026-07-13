import React from "react";

const MAX = {
  content: "var(--content-max-width)", // 768px (max-w-3xl)
  form: "var(--form-max-width)", // 384px (max-w-sm)
  full: "100%",
};

export function Container({ size = "content", padding = 16, children }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: MAX[size] ?? MAX.content,
        margin: "0 auto",
        padding,
        boxSizing: "border-box",
        fontFamily: "var(--font-sans)",
      }}
    >
      {children}
    </div>
  );
}
