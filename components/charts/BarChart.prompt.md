세로 막대 차트. 주간 활동, 월별 추이 등 범주형 수치 비교에 사용합니다. 외부 라이브러리 없이 DS 차트 팔레트(`--chart-*`)로 그립니다.

```jsx
<BarChart showValues data={[
  { label: "월", value: 62 }, { label: "화", value: 74 }, { label: "수", value: 58 },
]} />
```

`data`: `{label, value, color?}` 배열. `height`(px), `color`(기본 `--chart-1`), `showValues`(막대 위 값 표시). 막대별 `color`로 개별 지정 가능.
