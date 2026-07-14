import React from "react";

// 표준 앱 셸 레이아웃: 상단 Header + 중앙 콘텐츠(+선택적 좌측 Sidebar) + 하단 Footer.
// 게시판 목록/대시보드 같은 화면의 공통 뼈대를 정식화한 컴포넌트로, 매번 새로
// 정하던 gap/padding 값을 기본값으로 내장한다:
//   - 콘텐츠 세로 패딩  : --space-8 (32px)
//   - 콘텐츠 가로 패딩  : clamp(16px, 4vw, --space-10)  (반응형, 최대 40px)
//   - 콘텐츠 블록 간 gap: --space-6 (24px)
//   - 본문 최대 폭      : maxWidth (기본 1120) 중앙 정렬
//   - 배경             : --gray-50
// Footer는 padded 본문 밖(전체 폭)에 두어 경계선이 화면 전체를 가로지르고, Footer
// 자체 좌우 패딩으로 콘텐츠가 정렬된다. header/footer는 요소로 넘긴다.
export function AppShell({
  header,
  footer,
  children,
  maxWidth = 1120,
  background = "var(--gray-50)",
}) {
  return (
    <div style={{ background, minHeight: "100vh", fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column" }}>
      {header}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth,
          margin: "0 auto",
          padding: "var(--space-8) clamp(16px, 4vw, var(--space-10))",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
      {footer}
    </div>
  );
}
