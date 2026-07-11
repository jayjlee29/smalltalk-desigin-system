import React from "react";

export function Skeleton({ width = "100%", height = 16, radius = "var(--radius-default)", count = 1 }) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((i) => (
        <div
          key={i}
          style={{
            width: count > 1 && i === items.length - 1 ? "60%" : width,
            height,
            borderRadius: radius,
            background: "var(--gray-100)",
            animation: "ds-skeleton-pulse 1.5s ease-in-out infinite",
          }}
        />
      ))}
      <style>{"@keyframes ds-skeleton-pulse{0%,100%{opacity:1}50%{opacity:.45}}"}</style>
    </div>
  );
}
