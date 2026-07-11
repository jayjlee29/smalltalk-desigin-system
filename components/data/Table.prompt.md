포트폴리오 보유 종목 테이블 구조를 따르는 범용 데이터 테이블: `rounded-xl` 테두리, `gray-50` 헤더 행, `mono` 고정폭 숫자를 쓰는 우측 정렬 숫자 열, `hover` 행 틴트, 마지막 행 테두리 제거.

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
