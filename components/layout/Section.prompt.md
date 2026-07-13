제목이 있는 콘텐츠 블록. 페이지 내 하위 영역(보유 종목, 최근 활동 등)을 구분합니다.

```jsx
<Section title="보유 종목" description="미래에셋 ISA" actions={<Button size="sm">전체보기</Button>}>
  <Table ... />
</Section>
```

`title`(16px 600), `description`(gray-500), `actions`(우측 버튼)와 본문 `children`으로 구성합니다.
