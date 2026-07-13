게시판 선택·정렬 등에 쓰이는 드롭다운. 네이티브 `<select>` 기반, 우측 셰브론.

```jsx
<Select
  label="정렬"
  placeholder="선택"
  options={[{ value: "new", label: "최신순" }, { value: "hot", label: "인기순" }]}
/>
```

`options`는 `{value, label}` 배열입니다. 포커스 시 2px blue-500 링, `disabled` 시 gray-50 배경.
