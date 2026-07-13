도넛/파이 차트 + 범례(SVG). 자산 구성, 포트폴리오 비중 등 구성비에 사용합니다. 앱의 Recharts 파이 차트를 자체완결 SVG로 대체한 컴포넌트입니다.

```jsx
<DonutChart data={[
  { label: "국내주식", value: 52 }, { label: "해외주식", value: 28 }, { label: "현금", value: 20 },
]} />
```

`data`: `{label, value, color?}` 배열(색 미지정 시 `--chart-*` 팔레트 순환). `size`(px), `thickness`(도넛 두께). 우측에 색상·비율(%) 범례가 붙습니다.
