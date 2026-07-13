import React from "react";

// Responsive: the column template is passed via a CSS custom property so
// tokens/layout.css can collapse .ds-grid to a single column on small screens.
export function Grid({ columns = 2, gap = 16, minItemWidth, children }) {
  const cols = minItemWidth
    ? `repeat(auto-fill, minmax(${typeof minItemWidth === "number" ? minItemWidth + "px" : minItemWidth}, 1fr))`
    : `repeat(${columns}, minmax(0, 1fr))`;
  return (
    <div
      className="ds-grid"
      style={{ "--ds-grid-cols": cols, "--ds-grid-gap": typeof gap === "number" ? gap + "px" : gap, fontFamily: "var(--font-sans)" }}
    >
      {children}
    </div>
  );
}
