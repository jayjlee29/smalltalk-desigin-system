# Smalltalk 디자인 시스템 — 사용 가이드

한국어 커뮤니티 게시판 + 주식 포트폴리오 웹앱. `window.SmalltalkDS`에 7개의 React
컴포넌트가 있으며, **CSS 커스텀 속성 토큰**으로 스타일링됩니다(유틸리티 클래스 없음,
런타임 Tailwind 없음, style-prop 시스템 없음).

## 설정 — 스타일시트 하나, 스타일링에 프로바이더 불필요

```html
<!-- React가 먼저 페이지에 로드되어 있어야 합니다 -->
<link rel="stylesheet" href="styles.css">   <!-- 폰트 + 모든 토큰 @import -->
<script src="_ds_bundle.js"></script>        <!-- window.SmalltalkDS.* -->
```

`styles.css`가 전체 스타일링 표면입니다: Geist/Geist Mono(Google Fonts)와 모든 토큰
파일을 `@import`합니다. 컴포넌트는 이 토큰을 읽는 인라인 스타일로 스스로 스타일링합니다
— **`styles.css`를 링크하면 브랜드에 맞게 렌더링되고, 빼면 모든 토큰이 아무 값도 아닌
것으로 풀립니다.** 테마 프로바이더는 없습니다. 유일한 래퍼는 `ToastProvider`이며,
토스트를 쓸 때만 필요합니다(아래 참고).

## 스타일링 방식 — 클래스가 아니라 토큰

컴포넌트에 클래스를 붙이지 않습니다. **의미론적 prop**을 전달하고, *직접* 짜는
레이아웃 글루는 `var(--token)`으로 스타일링합니다. 토큰은 앱의 Tailwind 기본 스케일을
따르되 CSS 커스텀 속성으로 노출됩니다:

| 계열 | 실제 토큰 이름 |
|---|---|
| 색상 — 중립 | `--white`, `--gray-50` … `--gray-900` |
| 색상 — 브랜드/의미 | `--blue-600`(주요), `--blue-700`(호버), `--red-500`(위험 **및** 주가 상승), `--green-600`(성공), `--purple-700`/`--orange-700`/`--green-700`(계좌 유형 칩) |
| 색상 — 별칭 | `--accent`, `--danger`, `--success`, `--border-default`, `--border-error`, `--text-primary`, `--text-secondary`, `--text-link`, `--surface-subtle` |
| 차트 | `--chart-1` … `--chart-8`, `--chart-line-total` |
| 타이포 | `--font-sans`(Geist), `--font-mono`(Geist Mono — 가격/수량/퍼센트에 사용), `--text-xs`/`-sm`/`-base`/`-lg`/`-2xl`, `--font-medium`/`-semibold`/`-bold` |
| 간격 | `--space-1`(4px) … `--space-20`(80px), `--content-max-width`(768px), `--form-max-width`(384px), `--header-height`(56px) |
| 반경 / 입체 | `--radius-default`(4px), `--radius-lg`(8px, 기본), `--radius-xl`(12px, 강조 카드), `--radius-full`(알약), `--shadow-sm`, `--shadow-lg`, `--transition-default` |

지킬 만한 브랜드 규칙: **`--radius-lg`(8px)가 지배적인 반경**입니다. UI는 **플랫**합니다
(`--shadow-sm`은 호버된 카드에만, `--shadow-lg`는 토스트에만). **한국식 색상 관례 —
빨강 = 상승/이익(`--red-500`), 파랑 = 하락/손실(`--blue-500`)**. 숫자/표 데이터는
`--font-mono`로 렌더링합니다.

## 컴포넌트 (모두 `window.SmalltalkDS.*`)

- `Button` — `variant` primary/secondary/danger/ghost, `size` sm/md/lg, `disabled`
- `Input` — `label`, `error`, `type` text/password, `placeholder`, `compact`
- `Card` — `elevated`, `hoverable`, `gradient`, `padding`
- `Badge` — `tone` blue/gray/green/purple/orange, `pill`
- `Table` — `columns`(`{key,label,align,width,mono,render}`), `rows`, `rowKey`
- `Pagination` — `page`, `totalPages`, `onChange`
- `ToastProvider` + `useToast` — 앱을 `<ToastProvider>`로 한 번 감싼 뒤,
  하위 어디서든 `useToast().addToast(message, "error"|"success"|"info")`

## 반응형 (모바일 웹 / n-screen)

레이아웃 컴포넌트는 **반응형**입니다. 열 구조를 CSS 커스텀 속성으로 넘기고
`tokens/layout.css`의 미디어 쿼리가 작은 화면에서 단일 열로 접습니다 — 별도 prop
없이 자동입니다:
- **640px 이하**: `SidebarLayout`은 사이드바가 상단으로 올라가고 nav가 가로 행으로,
  `Split`은 단일 열로 스택. `Header`는 간격이 좁아지고 nav가 가로 스크롤.
- **520px 이하**: `Grid`(고정 열)도 1열로.

직접 레이아웃을 짤 때도 고정 px 폭 대신 `Grid minItemWidth` / `Container` /
`Stack`을 쓰면 화면 폭에 맞춰 흐릅니다. 커스텀 반응형이 필요하면 `.ds-grid` /
`.ds-split` / `.ds-sidebar-layout` 클래스 규칙(`tokens/layout.css`)을 참고하세요.

## 진짜 정보가 있는 곳

스타일링 전에 읽으세요: `styles.css`와 그 `tokens/*.css`(정확한 토큰 이름/값),
`components/<group>/<Name>/<Name>.prompt.md`(사용법 + 변형)와 `<Name>.d.ts`(prop),
그리고 `guidelines/*.html`(색상/타이포/간격/반경 참조 페이지).

## 관용적 예시 하나

```jsx
const { Card, Badge, Button } = window.SmalltalkDS;
// 컨트롤은 라이브러리 컴포넌트로, 직접 짜는 레이아웃 글루는 var(--*) 토큰으로.
<Card elevated hoverable>
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>미래에셋 ISA</span>
    <Badge tone="green">ISA</Badge>
  </div>
  <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xl)",
              color: "var(--red-500)", marginTop: "var(--space-2)" }}>
    +12.40%
  </p>
  <Button variant="ghost" size="sm">상세보기</Button>
</Card>
```
