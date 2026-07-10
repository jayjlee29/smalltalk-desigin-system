Generic bordered panel used for portfolio summary/account blocks.

```jsx
<Card gradient>...전체 요약...</Card>
<Card elevated hoverable>...계좌 카드...</Card>
```

`elevated` switches to `rounded-xl` (12px) for account/summary cards vs. the default `rounded-lg` (8px). `hoverable` adds the border-color + shadow-sm hover seen on clickable account cards — resting state always has zero shadow. `gradient` is reserved for the single portfolio-wide summary hero block; don't use elsewhere.
