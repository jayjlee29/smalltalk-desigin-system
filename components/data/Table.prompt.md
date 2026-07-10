Generic data table matching the portfolio holdings table's structure: `rounded-xl` border, `gray-50` header row, right-aligned numeric columns with `mono` tabular figures, `hover` row tint, last row border removed.

```jsx
<Table
  columns={[
    { key: "name", label: "종목" },
    { key: "qty", label: "수량", align: "right", mono: true },
    { key: "value", label: "평가금액", align: "right", mono: true },
  ]}
  rows={holdings}
  rowKey="id"
/>
```
