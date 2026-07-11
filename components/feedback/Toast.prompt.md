앱 전역 토스트 알림. 우측 하단에 쌓이고 4초 후 자동으로 사라집니다. 앱 루트를 한 번 감싼 뒤, 하위 어디서든 `useToast().addToast(message, type)`를 호출하세요.

```jsx
const { addToast } = useToast();
addToast("오류가 발생했습니다", "error");
```

유형(Types): `error`(red-500, 기본), `success`(green-600), `info`(gray-700). 이것이 디자인 시스템에서 사용하는 유일한 그림자(`shadow-lg`)이며, 일시적 오버레이 전용입니다.
