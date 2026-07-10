Buttons used across auth forms, comments, board actions, and edit/delete flows.

```jsx
<Button variant="primary">로그인</Button>
<Button variant="secondary">취소</Button>
<Button variant="danger">삭제</Button>
```

Variants: `primary` (blue-600, main actions), `secondary` (outline, cancel/utility), `danger` (red-500, destructive), `ghost` (text-only, inline links like 수정/삭제 in comments).
Sizes: `sm` (12px, comment actions), `md` (14px, default), `lg` (full-width, form submit buttons).
`disabled` drops opacity to 0.5, matching the source's loading-state buttons.
