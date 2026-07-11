로그인/회원가입 폼, 댓글, 게시판 액션, 수정/삭제 플로우 전반에서 쓰이는 버튼.

```jsx
<Button variant="primary">로그인</Button>
<Button variant="secondary">취소</Button>
<Button variant="danger">삭제</Button>
```

변형(Variants): `primary`(blue-600, 주요 액션), `secondary`(아웃라인, 취소/보조), `danger`(red-500, 파괴적 액션), `ghost`(텍스트 전용, 댓글의 수정/삭제 같은 인라인 링크).
크기(Sizes): `sm`(12px, 댓글 액션), `md`(14px, 기본), `lg`(전체 너비, 폼 제출 버튼).
`disabled`는 불투명도를 0.5로 낮춥니다 — 원본의 로딩 상태 버튼과 동일합니다.
