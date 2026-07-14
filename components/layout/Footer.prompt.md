페이지 하단 푸터. 워드마크 + 링크 + 저작권/설명 문구.

```jsx
<Footer
  links={[{ label: "이용약관", href: "#" }, { label: "개인정보처리방침", href: "#" }]}
  note="© 2026 Smalltalk Community."
/>
```

상단 1px gray-200 경계선, 워드마크는 gray-700, 링크는 gray-500. `note`는 gray-400 보조 문구입니다.

**좌우 패딩 내장**: 세로 `--space-6` + 가로 `clamp(16px, 4vw, --space-10)`을 컴포넌트가 직접 가지므로, `Container` 없이 전체 폭에 놓아도 콘텐츠가 화면 끝에 붙지 않습니다. 본문이 특정 max-width로 중앙 정렬된 경우 `maxWidth`를 같은 값으로 주면 푸터 콘텐츠도 본문과 좌우가 맞습니다. (`AppShell`의 `footer` 슬롯에 넣으면 전체 폭 경계선 + 정렬이 자동입니다.)
