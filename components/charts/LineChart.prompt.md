선/영역 추이 차트(SVG). 자산 추이, 시계열 변화에 사용합니다. 앱의 Recharts 라인 차트를 자체완결 SVG로 대체한 컴포넌트입니다.

```jsx
<LineChart data={[
  { label: "2월", value: 172 }, { label: "3월", value: 181 }, { label: "7월", value: 214 },
]} />
```

`data`: `{label, value}` 배열. `color`(기본 `--chart-1`), `area`(기본 true, 아래 영역 채움), `height`(px). 선 두께는 화면 크기와 무관하게 일정합니다.
