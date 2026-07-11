답글 작성 폼. 댓글 아래 중첩되는 컴팩트한 답글 입력으로, 좌측 라인으로 들여쓰기됩니다. Textarea + Button을 조합합니다.

```jsx
<ReplyForm replyingTo="스몰토커" onSubmit={(body) => reply(...)} onCancel={close} />
```

`replyingTo`를 주면 "@닉네임 님에게 답글" 안내가 표시됩니다. 2줄짜리 컴팩트 입력 + 취소/답글 등록 버튼.
