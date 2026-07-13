import React from "react";

// 접근성: role="tablist"/"tab" + aria-selected, 화살표 키(←/→)로 탭 이동,
// roving tabindex(활성 탭만 Tab 포커스), .ds-focus 포커스 링.
export function Tabs({ tabs = [], value, onChange }) {
  const onKey = (e, i) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = (i + dir + tabs.length) % tabs.length;
      onChange && onChange(tabs[next].key);
    }
  };
  return (
    <div role="tablist" style={{ fontFamily: "var(--font-sans)", display: "flex", gap: 4, borderBottom: "1px solid var(--gray-200)" }}>
      {tabs.map((t, i) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            className="ds-focus"
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => onChange && onChange(t.key)}
            style={{
              border: "none", background: "none", padding: "10px 14px", fontSize: 14, fontWeight: active ? 600 : 500,
              color: active ? "var(--blue-600)" : "var(--gray-500)", borderBottom: `2px solid ${active ? "var(--blue-600)" : "transparent"}`,
              marginBottom: -1, cursor: "pointer", transition: "var(--transition-default)",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
