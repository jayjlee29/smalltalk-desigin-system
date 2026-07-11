단일 선택 옵션 그룹. 예: 게시판 목록 방식(페이지네이션 vs 무한 스크롤) 선택.

```jsx
<RadioGroup
  value={v}
  onChange={setV}
  options={[{ value: "page", label: "페이지" }, { value: "scroll", label: "무한 스크롤" }]}
/>
```

`direction="horizontal"`로 가로 배치합니다. 선택 시 blue-600 점으로 표시됩니다.
