import React from "react";

// Responsive: the ratio is passed via a CSS custom property so
// tokens/layout.css can stack .ds-split to one column on small screens.
export function Split({ left, right, ratio = "1fr 1fr", gap = 20 }) {
  return (
    <div
      className="ds-split"
      style={{ "--ds-split-cols": ratio, "--ds-split-gap": typeof gap === "number" ? gap + "px" : gap, fontFamily: "var(--font-sans)" }}
    >
      <div style={{ minWidth: 0 }}>{left}</div>
      <div style={{ minWidth: 0 }}>{right}</div>
    </div>
  );
}
