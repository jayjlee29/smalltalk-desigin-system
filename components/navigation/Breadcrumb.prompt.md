경로 이동 표시. 슬래시로 구분하며, 현재 위치는 gray-900, 나머지는 blue-600 링크입니다.

```jsx
<Breadcrumb items={[
  { label: "홈", href: "/" },
  { label: "자유게시판", href: "/free" },
  { label: "글 제목" },
]} />
```

`items`의 마지막 항목이 현재 페이지로 강조됩니다.
