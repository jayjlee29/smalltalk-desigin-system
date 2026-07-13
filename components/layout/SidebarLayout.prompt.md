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
