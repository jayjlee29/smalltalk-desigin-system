설정 켜기/끄기 토글. 켜짐 상태는 blue-600.

```jsx
<Switch checked={on} onChange={setOn} label="알림 받기" />
```

`onChange`는 다음 상태(boolean)를 인자로 받습니다. `disabled` 시 불투명도 0.5.
