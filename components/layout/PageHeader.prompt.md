페이지 상단 제목 영역. 24px 제목 + 보조 문구 + 우측 액션 버튼.

```jsx
<PageHeader
  title="자유게시판"
  subtitle="자유롭게 이야기를 나누는 공간"
  actions={<Button variant="primary" size="sm">글쓰기</Button>}
/>
```

`title`은 24px bold(text-2xl), `subtitle`은 gray-500. `actions`에 버튼 등을 넣습니다.
