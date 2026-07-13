import React from "react";

export function Stack({ direction = "vertical", gap = 12, align, justify, wrap = false, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
        gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : "nowrap",
        fontFamily: "var(--font-sans)",
      }}
    >
      {children}
    </div>
  );
}
