고정 사이드바 내비 + 본문 콘텐츠의 2단 셸. 대시보드, 카테고리형 게시판 화면의 뼈대입니다.

```jsx
<SidebarLayout
  title="게시판"
  nav={[{ label: "자유게시판", active: true, count: 128 }, { label: "질문게시판", count: 42 }]}
>
  ...본문...
</SidebarLayout>
```

`nav` 항목: `{label, href, active, count}`. 활성 항목은 blue-50 배경 + blue-600. 사이드바는 sticky이며 `sidebarWidth`(px)로 폭을 조절합니다.

## 상단 정렬 기본값
사이드바 헤더(`title`)와 본문 콘텐츠가 같은 상단 오프셋(`--space-3`)에서 시작하도록 aside 패딩과 본문 wrapper의 `paddingTop`이 맞춰져 있습니다. **본문 첫 요소를 `PageHeader`로 두면**(타이틀 top-padding 0) 사이드바 헤더 텍스트와 본문 타이틀 텍스트의 상단이 자동으로 정렬되어, 매번 `margin-top`을 수동 보정할 필요가 없습니다.

## 표준 앱 셸 (Header + Sidebar + 콘텐츠 + Footer)
게시판 목록처럼 상단 Header, 좌측 Sidebar, 중앙 콘텐츠, 하단 Footer로 구성하는 표준 레이아웃은 **`AppShell`** 컴포넌트로 정식화되어 있습니다(gap `--space-6`, 콘텐츠 패딩 `--space-8`~`--space-10` 기본 내장). `SidebarLayout`은 그 중앙 콘텐츠 안에 넣어 좌측 내비를 구성합니다 — 자세한 조합은 `AppShell.prompt.md`를 참고하세요.

```jsx
<AppShell header={<Header .../>} footer={<Footer .../>}>
  <SidebarLayout title="게시판" nav={[...]}>
    <PageHeader title="자유게시판" .../>
    {/* ...목록... */}
  </SidebarLayout>
</AppShell>
```
