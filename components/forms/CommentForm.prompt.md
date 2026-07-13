댓글 작성 폼. 계정 없이 닉네임 + 비밀번호(수정/삭제용)로 익명 댓글을 다는 원본 앱 패턴을 따릅니다. Avatar + Input + Textarea + Button을 조합합니다.

```jsx
<CommentForm onSubmit={({ nickname, password, body }) => post(...)} />
<CommentForm anonymous={false} author="스몰토커" />   {/* 로그인 상태: 닉네임/비밀번호 숨김 */}
```

`anonymous`(기본 true)면 닉네임·비밀번호 입력을 표시합니다. 로그인 상태에서는 `anonymous={false}`로 두고 `author`를 넘기면 아바타만 표시됩니다.
