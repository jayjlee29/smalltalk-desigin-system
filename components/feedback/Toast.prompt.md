App-wide toast notifications, stacked bottom-right, auto-dismiss after 4s. Wrap the app root once; call `useToast().addToast(message, type)` anywhere below.

```jsx
const { addToast } = useToast();
addToast("오류가 발생했습니다", "error");
```

Types: `error` (red-500, default), `success` (green-600), `info` (gray-700). This is the only shadow (`shadow-lg`) used anywhere in the design system — reserved for transient overlays.
