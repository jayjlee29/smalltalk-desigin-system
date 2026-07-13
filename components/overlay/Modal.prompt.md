중앙 정렬 다이얼로그. 삭제 확인, 로그인 등 오버레이 흐름에 사용합니다. 배경 클릭 시 `onClose`가 호출됩니다.

```jsx
<Modal
  open
  title="게시글 삭제"
  footer={<><Button variant="secondary">취소</Button><Button variant="danger">삭제</Button></>}
>
  정말 삭제하시겠습니까?
</Modal>
```

`title`/`children`/`footer` 슬롯으로 구성합니다. `rounded-xl` + `shadow-lg`이며, 화면 전체를 덮는 fixed 오버레이입니다.
