전역 고정 앱 바(sticky header). 워드마크 + 네비게이션 링크 + 우측 슬롯(로그인 버튼/아바타 등).

```jsx
<Header
  brand="Smalltalk Community"
  links={[{ label: "게시판", href: "/boards", active: true }, { label: "포트폴리오", href: "/portfolio" }]}
  right={<Button variant="primary" size="sm">로그인</Button>}
/>
```

높이 56px(`--header-height`), 하단 1px gray-200 경계선, 흰 배경. 내부 콘텐츠는 768px 폭으로 중앙 정렬됩니다. `active` 링크는 blue-600.
