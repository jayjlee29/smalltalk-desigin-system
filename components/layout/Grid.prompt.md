반응형 그리드 레이아웃. 카드 목록, 통계 KPI, 계좌 카드 배치 등에 사용합니다.

```jsx
<Grid columns={3} gap={16}>...</Grid>
<Grid minItemWidth={220}>...</Grid>   {/* auto-fill: 폭에 맞춰 열 수 자동 */}
```

`columns`로 고정 열 수를, `minItemWidth`로 최소 항목 폭 기반 auto-fill을 지정합니다(둘 중 하나). `gap`은 간격(px).
