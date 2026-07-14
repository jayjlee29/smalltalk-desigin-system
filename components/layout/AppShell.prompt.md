표준 앱 셸 레이아웃. 상단 `Header` + 중앙 콘텐츠(+선택적 좌측 `SidebarLayout`) + 하단 `Footer`로 구성하는 게시판 목록·대시보드 화면의 공통 뼈대입니다. 매번 새로 정하던 gap/padding 값을 **기본값으로 내장**해, 조합할 때마다 여백을 다시 맞출 필요가 없습니다.

```jsx
const { AppShell, Header, SidebarLayout, PageHeader, Split, Footer, Button } = window.SmalltalkDS;

<AppShell
  header={<Header brand="Smalltalk Community" links={[{ label: "게시판", href: "#", active: true }, { label: "포트폴리오", href: "#" }]} right={<Button variant="ghost" size="sm">로그인</Button>} />}
  footer={<Footer links={[{ label: "이용약관", href: "#" }]} note="© 2026 Smalltalk Community." />}
>
  <SidebarLayout title="게시판" nav={[{ label: "자유게시판", active: true, count: 128 }, { label: "질문게시판", count: 42 }]}>
    {/* 본문 첫 요소를 PageHeader로 두면 사이드바 헤더와 타이틀 상단이 자동 정렬됨 */}
    <PageHeader title="자유게시판" subtitle="자유롭게 이야기를 나누는 공간" actions={<Button variant="primary" size="sm">글쓰기</Button>} />
    {/* ...목록/콘텐츠... */}
  </SidebarLayout>
</AppShell>
```

## 내장 기본값 (매번 새로 정하지 않아도 됨)
- **콘텐츠 세로 패딩**: `--space-8`(32px) · **가로 패딩**: `clamp(16px, 4vw, --space-10)`(반응형, 최대 40px)
- **콘텐츠 블록 간 gap**: `--space-6`(24px)
- **본문 최대 폭**: `maxWidth`(기본 1120) 중앙 정렬 · **배경**: `--gray-50`

## 셸 구성 규칙
- `header`는 상단, `footer`는 padded 본문 **밖(전체 폭)**에 렌더 → 경계선이 화면 전체를 가로지르고 `Footer` 자체 좌우 패딩으로 콘텐츠가 정렬됩니다.
- 좌측 사이드바가 필요하면 본문에 `SidebarLayout`을 넣습니다. `SidebarLayout`은 사이드바 헤더와 본문 타이틀의 **상단 정렬 기본값**을 내장하므로, 본문 첫 요소를 `PageHeader`로 두면 수동 `margin-top` 보정이 필요 없습니다.
- 사이드바 없이 단일 열이면 `AppShell` 안에 바로 `PageHeader` + 콘텐츠를 넣습니다.
