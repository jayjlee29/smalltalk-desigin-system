게시판 글쓰기 폼. 카테고리 선택 + 제목 + 본문 + 태그 + 등록/취소를 갖춘 복합 컴포넌트로, DS의 `Select`·`Input`·`Textarea`·`Tag`·`Button`을 조합합니다.

```jsx
<PostEditor
  categories={[{ value: "free", label: "자유게시판" }, { value: "qna", label: "질문게시판" }]}
  onSubmit={({ category, title, body, tags }) => save(...)}
  onCancel={() => history.back()}
/>
```

태그 입력창에 입력 후 Enter로 태그를 추가하고, 칩의 ×로 제거합니다. 하단에 본문 글자 수가 표시됩니다. `default*` prop으로 초기값(수정 화면 등)을 채울 수 있습니다. `rounded-xl` 카드 안에 배치되며, 상세 입력 스타일은 각 하위 컴포넌트를 따릅니다.
