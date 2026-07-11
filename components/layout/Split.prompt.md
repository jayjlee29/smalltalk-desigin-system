두 영역을 비율로 나누는 2단 분할. 본문 + 사이드 위젯, 좌우 비교 등에 사용합니다.

```jsx
<Split ratio="2fr 1fr" left={<주콘텐츠 />} right={<사이드 />} />
```

`ratio`는 CSS grid-template-columns 값(`"2fr 1fr"`, `"320px 1fr"` 등), `gap`은 간격(px). 좁은 화면에서는 콘텐츠를 세로로 쌓도록 상위에서 조정하세요.
