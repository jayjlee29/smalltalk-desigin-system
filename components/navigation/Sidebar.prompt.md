독립형 세로 내비게이션 메뉴(사이드 메뉴). 게시판 카테고리, 대시보드 메뉴 등에 사용하며 `SidebarLayout` 안에 넣거나 단독으로 배치합니다.

```jsx
<Sidebar header="게시판" items={[
  { label: "자유게시판", active: true, count: 128 },
  { label: "질문게시판", count: 42 },
  { section: true, label: "내 활동" },
  { label: "내 글", count: 8 },
]} />
```

`items`: `{label, href, active, count, icon, section}`. `section: true`면 링크 대신 소제목으로 렌더링됩니다. 활성 항목은 blue-50 배경 + blue-600, `count`는 우측 정렬. (2단 셸이 필요하면 `SidebarLayout`을 쓰세요.)
