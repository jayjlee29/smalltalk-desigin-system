포트폴리오 요약/계좌 블록에 쓰이는 범용 테두리 패널.

```jsx
<Card gradient>...전체 요약...</Card>
<Card elevated hoverable>...계좌 카드...</Card>
```

`elevated`는 기본 `rounded-lg`(8px) 대신 계좌/요약 카드용 `rounded-xl`(12px)로 전환합니다. `hoverable`은 클릭 가능한 계좌 카드에서 보이는 테두리 색 + shadow-sm 호버를 추가합니다 — 기본 상태는 항상 그림자가 없습니다. `gradient`는 포트폴리오 전체 요약 히어로 블록 하나에만 예약되어 있으니 다른 곳에는 쓰지 마세요.
