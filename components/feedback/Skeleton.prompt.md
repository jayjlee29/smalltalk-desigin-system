로딩 자리표시자. 원본 앱의 gray `animate-pulse` 스켈레톤 패턴을 따릅니다.

```jsx
<Skeleton count={3} height={16} />
```

`count`가 2 이상이면 마지막 줄은 60% 너비로 렌더링되어 문단 로딩처럼 보입니다. `width`/`height`/`radius`로 형태를 조절합니다.
