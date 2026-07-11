import React from "react";

export function Spinner({ size = 20, color = "var(--blue-600)" }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: "2px solid var(--gray-200)",
        borderTopColor: color,
        borderRadius: "var(--radius-full)",
        boxSizing: "border-box",
        animation: "ds-spinner-spin .7s linear infinite",
      }}
    >
      <style>{"@keyframes ds-spinner-spin{to{transform:rotate(360deg)}}"}</style>
    </span>
  );
}
