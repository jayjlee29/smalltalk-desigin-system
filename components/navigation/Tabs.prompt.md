밑줄형 탭. 포트폴리오 계좌나 게시판 카테고리 전환에 사용합니다. 활성 탭은 blue-600 밑줄로 표시됩니다.

```jsx
<Tabs
  value={tab}
  onChange={setTab}
  tabs={[{ key: "all", label: "전체" }, { key: "isa", label: "ISA" }]}
/>
```

`tabs`는 `{key, label}` 배열입니다. 하단 1px gray-200 경계선 위에 표시됩니다.
