import React from "react";

// Responsive: the sidebar width is passed via a CSS custom property and the
// grid/nav direction live in tokens/layout.css, which stacks .ds-sidebar-layout
// (sidebar on top, nav as a wrapping row) on small screens.
//
// 상단 정렬 기본값: 사이드바 헤더(title)와 본문 콘텐츠가 같은 상단 오프셋
// (--space-3)에서 시작하도록 aside 패딩과 콘텐츠 wrapper의 paddingTop을 맞춘다.
// 본문 첫 요소를 <PageHeader>(타이틀 top-padding 0)로 두면 사이드바 헤더 텍스트와
// 본문 타이틀 텍스트의 상단이 자동으로 정렬되어, 수동 margin-top 보정이 필요 없다.
export function SidebarLayout({ nav = [], title, sidebarWidth = 220, children }) {
  return (
    <div
      className="ds-sidebar-layout"
      style={{ "--ds-sidebar-w": typeof sidebarWidth === "number" ? sidebarWidth + "px" : sidebarWidth, fontFamily: "var(--font-sans)" }}
    >
      <aside
        className="ds-sidebar-layout__aside"
        style={{ border: "1px solid var(--gray-200)", borderRadius: "var(--radius-xl)", background: "var(--white)", padding: "var(--space-3)" }}
      >
        {title && (
          <div style={{ fontSize: 12, color: "var(--gray-400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".03em", padding: "0 var(--space-2) var(--space-2)" }}>
            {title}
          </div>
        )}
        <nav className="ds-sidebar-layout__nav">
          {nav.map((it, i) => (
            <a
              key={i}
              href={it.href || "#"}
              aria-current={it.active ? "page" : undefined}
              className="ds-focus"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                fontSize: 14,
                padding: "8px 10px",
                borderRadius: "var(--radius-lg)",
                color: it.active ? "var(--blue-600)" : "var(--gray-600)",
                background: it.active ? "var(--blue-50)" : "transparent",
                fontWeight: it.active ? 600 : 500,
              }}
            >
              <span>{it.label}</span>
              {it.count != null && <span style={{ fontSize: 12, color: "var(--gray-400)" }}>{it.count}</span>}
            </a>
          ))}
        </nav>
      </aside>
      {/* 본문 상단 오프셋을 aside의 상단 패딩(--space-3)과 맞춰 사이드바 헤더와 정렬 */}
      <div style={{ minWidth: 0, paddingTop: "var(--space-3)" }}>{children}</div>
    </div>
  );
}
