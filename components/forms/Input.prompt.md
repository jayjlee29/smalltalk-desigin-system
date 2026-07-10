Text/password field used in login, register, and comment forms.

```jsx
<Input label="아이디" placeholder="영문 소문자 시작, 4~15자" />
<Input label="비밀번호" type="password" error="비밀번호가 일치하지 않습니다" />
```

Focus state is a 2px blue-500 ring (not just a border color change). Error state switches border to red-400 and shows a 12px red message below. `compact` shrinks padding for inline contexts (comment reply forms).
