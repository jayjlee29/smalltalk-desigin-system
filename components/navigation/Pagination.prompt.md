번호 매김 페이지네이션 행. 게시판 목록과 게시판 글 목록에서 동일하게 사용됩니다.

```jsx
<Pagination page={2} totalPages={5} onChange={setPageNo} />
```

활성 페이지는 채워진 `blue-600`이고, 비활성 페이지는 테두리가 있는 흰색 버튼으로 `gray-50` 호버 채움이 적용됩니다. 36×36px 정사각형 버튼, `rounded-lg`.
