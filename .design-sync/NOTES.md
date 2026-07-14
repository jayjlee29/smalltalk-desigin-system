# design-sync 노트 — smalltalk-design-system

## 이 저장소는 OFF-SCRIPT 입니다 (npm 패키지 / dist / Storybook 없음)

표준 컨버터(`package-build.mjs` / `resync.mjs`)를 여기서는 **실행할 수 없습니다**:
`package.json`도, 빌드된 `dist/`도, Storybook도 없습니다. 컴포넌트는 손으로 작성된,
인라인 스타일 + CSS 변수 토큰을 쓰는 self-contained React(`.jsx`)입니다.

빌드는 커밋된 off-script 스크립트 **`.design-sync/build.mjs`**가 담당합니다.
이 스크립트는 컨버터 자체의 라이브러리 함수(`lib/bundle.mjs`의 `bundleToIife`
+ `stampHeader`, `lib/emit.mjs`의 `vendorReact`/`emitReviewPage`,
`lib/sync-hashes.mjs`)를 재사용하므로, 출력 레이아웃이 claude.ai/design self-check와
바이트 단위로 호환됩니다. 게이트는 여전히 `package-validate.mjs`(반드시 0으로 종료)이며,
통과합니다.

### 재빌드 / 재동기화 방법 (저장소 루트에서)

```sh
# 1. 스킬 스크립트 재배치 (gitignore된 .ds-sync/에 있음)
SB="<design-sync 스킬 베이스 디렉터리>"
mkdir -p .ds-sync && cp -r "$SB"/package-*.mjs "$SB"/resync.mjs "$SB"/lib "$SB"/storybook .ds-sync/
echo '{"name":"ds-sync-deps","private":true}' > .ds-sync/package.json
(cd .ds-sync && npm i esbuild react@18 react-dom@18 typescript playwright && npx playwright install chromium)

# 2. build.mjs가 esbuild를 해석할 수 있도록 fork 심링크 재생성
ln -sfn ../.ds-sync/node_modules .design-sync/node_modules

# 3. 빌드 + 게이트
node .design-sync/build.mjs
node .ds-sync/package-validate.mjs ./ds-bundle
```

그다음 스킬의 §5(이제 채워진 프로젝트로의 재동기화이므로 atomic 경로)에 따라 `DesignSync`
도구로 업로드합니다. `_ds_sync.json`은 생성되지만 여기서 이를 소비하는 드라이버가 없으므로,
재동기화는 사실상 전부 재검증합니다(카드 7개라 저렴함).

## 컴포넌트 이름 매핑

- 저장소의 "Toast" 컴포넌트는 **`ToastProvider`**로 업로드됩니다 — 실제 번들 export
  이름(`ToastProvider` + `useToast` 훅)입니다. `[BUNDLE_EXPORT]` 스모크 체크는 나열된
  모든 컴포넌트 이름이 실제 `window.*` export여야 하는데 `Toast` export는 존재하지
  않습니다. `Toast.d.ts`/`Toast.prompt.md`는 번들에서 `ToastProvider.*`로 복사됩니다.

## 카드

- 카드는 self-contained입니다: 각 데모 JSX는 저장소 자신의 `components/**/*.card.html`
  안 `<script id="app-src">`에서 그대로 가져와, esbuild로 순수 `React.createElement`
  JS로 변환해(Babel 없음) 인라인합니다. React는 `_vendor/react.js`에서 로드됩니다.
- **ToastProvider**만 유일하게 직접 작성한 데모입니다(저장소의 원래 토스트 카드는 정적 HTML
  목업이었음). 실제 `ToastProvider` + 마운트 시 `useToast`로 토스트 3개(error/success/info)를
  발생시키는 자식 컴포넌트를 렌더링합니다. 토스트는 `position:fixed` 우측 하단이라
  `package-validate`의 1200×800 스크린샷에서는 페이지 모서리에 나타납니다(정상 동작);
  DS 패널에서는 카드 iframe 모서리에 붙습니다.

## 알려진 렌더링 특성 (결함 아님)

- **Geist / Geist Mono**의 `[FONT_REMOTE]`: 폰트는 `tokens/fonts.css`의 원격 `@import`를
  통해 Google Fonts에서 로드됩니다. 헤드리스 Chromium(네트워크 없음)의 렌더 체크
  스크린샷은 시스템 폰트로 대체됩니다 — 정상입니다. 실제 DS 패널은 Geist를 로드합니다.
  이를 font-missing 문제로 쫓지 마세요.
- `_ds_bundle.css`는 의도적으로 없습니다: 컴포넌트는 `var(--*)` 토큰을 읽는 인라인
  스타일로 스스로 스타일링하며, (styles.css @import 클로저에 있는) 토큰들이 렌더링된
  디자인이 받는 전체 스타일링 표면입니다. 컴포넌트 CSS 파일이 없으므로
  `[CSS_BUNDLE_UNREACHABLE]`도 발생하지 않습니다.
- `.d.ts` 파싱 체크 "skipped — typescript not in node_modules": 베스트 에포트;
  `.d.ts`는 저장소가 손으로 작성한 유효한 TS입니다. `.ds-sync`에 `typescript`를 설치하면
  활성화됩니다.

## 재동기화 리스크 (조용히 낡을 수 있는 것)

- **off-script 빌더는 맞춤형입니다.** 스킬의 `lib/bundle.mjs`, `lib/emit.mjs`,
  `lib/sync-hashes.mjs`가 시그니처를 바꾸면 `build.mjs`가 깨질 수 있습니다 — 이 스크립트는
  `bundleToIife`, `stampHeader`, `vendorReact`, `emitReviewPage`, `styleShaFor`,
  `renderHashFor`, `auxShaFor`, `scriptsShaFor`, `KEY_RECIPE`를 임포트합니다.
  재동기화 시 현재 lib와 diff하세요.
- **새 컴포넌트**를 저장소에 추가하면 `build.mjs`의 `COMPONENTS` 배열에도 추가해야 합니다
  (인터랙션 주도형이면 `AUTHORED_DEMOS` 항목도). 자동 발견은 없습니다.
- **`ui_kits/`는 동기화되지 않습니다.** 저장소에 `ui_kits/community/index.html`과
  `ui_kits/portfolio/index.html`(전체 화면 클릭형 목업)이 있습니다. 이들은 컴포넌트가
  아니어서 번들에서 제외됩니다. DS 패널이 전체 화면 시작점 킷을 담아야 한다면 재검토하세요.
- **폰트는 네트워크에서 가져옵니다**(Google Fonts). DS가 Geist를 셀프 호스팅하게 되면
  woff2 + `@font-face`를 함께 배포하고 `tokens/fonts.css`를 갱신하세요.
- `_ds_sync.json`은 생성되지만 여기서 어떤 드라이버도 소비하지 않습니다 — 이월된 검증
  상태는 사실상 사용되지 않으며, 카드 7개에서는 재검증이 저렴합니다.

## 참고: 컴포넌트 16개 확장 + 갤러리 (2026-07-11)

사용자 요청으로 자주 쓰는 컴포넌트 16개를 추가해 총 **23개**가 되었습니다:
- 폼: Textarea, Select, Checkbox, RadioGroup, Switch
- 피드백: Alert, Skeleton, Spinner, EmptyState
- 오버레이(신규 그룹): Modal
- 디스플레이(신규 그룹): Avatar, Tag
- 레이아웃: Divider
- 네비게이션: Tabs, Breadcrumb, Link

이후 레이아웃 컴포넌트 3개를 더 추가해 총 **26개**가 되었습니다:
- 레이아웃: Container(중앙 정렬 열), Header(고정 앱 바), PageHeader(페이지 제목+액션)

그리고 `build.mjs`의 `SCREENS`로 **전체 화면 템플릿 3종**을 추가했습니다
(`ds-bundle/screens/*.html`, 실제 DS 컴포넌트로 조합): 게시판 목록(board-list),
포트폴리오 대시보드(portfolio), 로그인(login). 갤러리에 **화면** 탭으로 노출됩니다.
`screens/`도 `examples/`처럼 로컬 갤러리 전용(업로드 대상 아님)입니다.

### 레이아웃 구조 강화 (2026-07-11)

"레이아웃이 너무 단순하다"는 피드백으로 **구조용 레이아웃 컴포넌트 6개**를 더 추가해
총 **32개**가 되었습니다: Grid, Stack, Section, Split, SidebarLayout, Footer (모두 layout 그룹).
그리고 화면을 사이드바/대시보드형으로 **재구성**했습니다(모두 SCREENS, 실제 DS 컴포넌트로 조합):
- community(커뮤니티 게시판): SidebarLayout(게시판 nav) + Split(글목록 / 인기글·태그 위젯) + Footer — 3영역
- dashboard(포트폴리오 대시보드): SidebarLayout(계좌 nav) + Grid(KPI 4) + 막대 차트(div) + Table + Footer
- analytics(운영 통계 대시보드): SidebarLayout(관리 nav) + Grid(KPI) + Split(주간활동 차트 / 인기게시판) + 신고 Table + Footer
- login(유지)

차트는 별도 컴포넌트가 아니라 데모 안에서 div + `--blue-*` 토큰으로 그린 막대입니다
(원본 앱은 Recharts지만 번들 크기/자체완결성 위해 인라인). 갤러리(index.html)에는
컴포넌트 검색창 + 카테고리 칩 + sticky 그룹 헤더를 추가했습니다.

### PostEditor(게시판 글쓰기) 추가 (2026-07-11)

복합 컴포넌트 **`PostEditor`**(forms 그룹)를 추가해 총 **37개**. 카테고리 Select + 제목
Input + 본문 Textarea + 태그(Input+Tag) + 취소/등록 Button을 조합. **다른 DS 컴포넌트를
import해서 조합하는 첫 컴포넌트** — `PostEditor.jsx`가 `./Input.jsx`·`./Select.jsx`·
`./Textarea.jsx`·`./Button.jsx`·`../display/Tag.jsx`를 import(synth entry가 PostEditor만
export해도 esbuild가 의존 컴포넌트를 함께 번들). 태그 추가는 Input에 onKeyDown이 없어
래퍼 div의 keydown으로 처리. `default*` prop으로 초기값(수정 화면).

### 레이아웃 패턴 정식화: AppShell + Footer/SidebarLayout 정렬 (2026-07-14)

board-list(구 community) 화면에서 검증된 레이아웃 패턴을 컴포넌트/문서에 반영(총 **41개**):
- **Footer** — 좌우 패딩 내장(`clamp(16px,4vw,--space-10)`) + 세로 `--space-6`, marginTop `--space-8`.
  Container 없이 전체 폭에 놓아도 콘텐츠가 화면 끝에 안 붙음. `maxWidth` prop 추가(본문과 좌우 정렬).
- **SidebarLayout** — 상단 정렬 기본값: aside 상단 패딩(`--space-3`)과 본문 wrapper `paddingTop`
  (`--space-3`)을 맞춰, 본문 첫 요소가 `PageHeader`면 사이드바 헤더와 타이틀 상단이 자동 정렬
  (수동 margin-top 보정 불필요). **PageHeader** 타이틀 top-padding 0으로 변경.
- **AppShell**(신규, layout) — Header + 콘텐츠(+SidebarLayout) + Footer 표준 셸. 기본값 내장:
  콘텐츠 세로 `--space-8`, 가로 `clamp(16px,4vw,--space-10)`, 블록 gap `--space-6`, maxWidth 1120,
  배경 gray-50. footer는 padded 본문 밖(전체 폭)에 렌더. 문서: AppShell.prompt.md + SidebarLayout.prompt.md.
- 화면 `community`→`board-list`로 정식화, AppShell 사용하도록 리팩터. 렌더 검증 완료(사이드바
  헤더↔타이틀 정렬, Footer 전체폭+여백). dashboard/analytics/login/register는 기존 조합 유지(정상).

### 쇼케이스 탭 개선 (2026-07-13)

"예제 · 화면" 탭을 **쇼케이스**로 개명하고 컴포넌트 탭 수준으로 강화(모두 로컬):
- 사이드 메뉴: "예제 조합/화면" 그룹 없이 **전체 항목 가나다(ko) 순 평면 목록**
  (`showcaseItems` = EXAMPLES+SCREENS를 `title.localeCompare(ko)`로 정렬). 각 항목에
  유형 라벨(예제/화면 `.mi-type`) + 사용 컴포넌트 부제(`.mi-sub`) + 스크롤스파이. 본문도
  동일 순서(patternsView가 showcaseItems로 렌더).
- 각 예제/화면을 **카드**(border/padding)로, **사용 컴포넌트 칩**(`.use-chip`) +
  **코드 `<details>`+복사** 추가.
- **화면**엔 데스크톱/모바일 **뷰포트 토글**(`.vp-btn` → iframe width 전환)로 반응형 확인.
- 예제 추가: EXAMPLES 4→6(프로필 카드, 검색 바), SCREENS 4→5(회원가입).
`patternBlock`/`menuPatterns`가 담당. 번들 불변(쇼케이스는 로컬 갤러리) → Design 재업로드 없음.

### 접근성(a11y) 개선 + 갤러리 a11y 패널 (2026-07-13)

컴포넌트 접근성 결함 수정:
- **Switch** — role="switch" 버튼으로 재작성(키보드 Tab/Space, aria-checked). 기존엔 input이
  없어 키보드 조작 불가였던 버그.
- **Checkbox/RadioGroup** — input을 시각 박스 앞에 두고 a11y.css의
  `.ds-check-input:focus-visible + .ds-*-box`로 포커스 링. RadioGroup role="radiogroup".
- **Input/Textarea/Select** — label을 htmlFor/id로 연결(기존 미연결=접근 이름 없음),
  label 없으면 placeholder→aria-label, 에러 aria-invalid+aria-describedby. `React.useId()` 사용.
- **Modal** — role="dialog"+aria-modal, 열릴 때 포커스, Esc 닫기, Tab 포커스 트랩, 닫힐 때 복원.
- **Tabs** — role=tablist/tab, aria-selected, ←/→ 이동, roving tabindex.
- **Pagination** — nav aria-label, 버튼 aria-label+aria-current.
- **Sidebar/SidebarLayout/Breadcrumb** — 활성 항목 aria-current="page".
- **Alert** — role alert/status + 닫기 aria-label. **Toast** — 컨테이너 aria-live="polite" +
  토스트 role alert/status. **Tag** — 제거 버튼 aria-label.
- 커스텀 버튼/링크에 `.ds-focus`(a11y.css: white+blue-500 이중 링), prefers-reduced-motion 대응.

새 파일 **`tokens/a11y.css`**(styles.css가 @import). a11y 변경은 컴포넌트 구현(번들)+전역 CSS라
카드 html/.d.ts는 불변 → **업로드 델타 = `_ds_bundle.js`+`styles.css`+`tokens/a11y.css`+`_ds_sync.json`**.

**갤러리 a11y 패널** — 각 카드 `<details> a11y`에서 렌더된 iframe DOM을 휴리스틱 검사(이름 없는
버튼/링크, alt 없는 img, 라벨 없는 폼 요소) → ✓통과/⚠경고. **40/40 통과**. axe 같은 정식 도구는
아님(자체완결 유지). 이 패널이 Input/Select의 label 미연결 결함을 잡아내서 즉시 수정함.

### 갤러리 스토리북화 (2026-07-11)

`index.html` 갤러리를 스토리북 수준으로 강화(로컬 전용, 번들/업로드 불변):
- **Playground** — 컴포넌트별 인터랙티브 컨트롤. `build.mjs`가 `.d.ts`의 `<Name>Props`
  인터페이스를 파싱(`parseApi`/`classifyType`)해 enum→select, boolean→checkbox,
  number/string→input, children→text 컨트롤 생성. `ds-bundle/_playground/<Name>.html`
  (25개, 필수 complex prop 없는 컴포넌트만; PG_DENY=ToastProvider/Modal). 컨트롤 변경 시
  미리보기+코드 실시간 갱신.
- **Props 표** — `.d.ts`에서 이름/타입/기본값(.jsx destructure) 자동 표.
- **코드+복사** — 데모 JSX + 클립보드 복사.
갤러리 카드 하단에 Playground 링크 + `<details>` Props/코드. `_playground/`는 examples/
screens처럼 로컬 전용(업로드 안 함). 미구현(다음): 스토리 개별 분리, 테마/뷰포트 토글,
a11y 패널.

### 새글 에디터 3종(Editor) 추가 (2026-07-11)

앱 새글작성이 쓰는 외부 에디터 모듈 3종(**기본 Textarea / TipTap / Novel**)의 편집
표면·툴바를 DS 토큰으로 표현한 **`Editor`** 컴포넌트(variant 3종)를 추가(총 **40개**).
**실제 TipTap/Novel 라이브러리는 자체완결 번들에 담을 수 없어** UI 스펙(툴바 구성·
편집 표면·상호작용 힌트)만 표현 — basic만 실제 입력 동작(Textarea), tiptap/novel은
대표 서식 표현. `PostEditor`에 `editor` prop 연결(새글작성 폼에서 전환). prompt.md에
"실제 라이브러리는 앱 연동, DS는 스펙" 명시.

### 게시판 글쓰기 3종 완성 (2026-07-11)

게시판 글쓰기 모듈 3종을 forms 그룹 복합 컴포넌트로 완성(총 **39개**):
`PostEditor`(게시글) + `CommentForm`(댓글, 익명 닉네임/비밀번호) + `ReplyForm`(답글,
중첩/컴팩트). 셋 다 다른 DS 컴포넌트를 import해 조합(PostEditor 패턴과 동일).

### 차트 컴포넌트 추가 (2026-07-11)

신규 **차트** 그룹 3개(`BarChart`/`LineChart`/`DonutChart`)를 추가해 총 **36개**.
외부 라이브러리(Recharts) 없이 자체완결 SVG/div로 그리고 `--chart-*` 팔레트 사용.
`GROUP_LABELS.charts='차트'` + `GROUP_ORDER`에 data 다음으로 삽입.
대시보드/통계 화면의 인라인 div 차트(`Bars` 함수)를 이 컴포넌트로 교체(dogfooding):
dashboard 자산추이→LineChart, 자산구성→DonutChart 추가, analytics 주간활동→BarChart.

### Sidebar 컴포넌트 추가 (2026-07-11)

독립형 세로 사이드 메뉴 **`Sidebar`**(navigation 그룹)를 추가해 총 **33개**.
`SidebarLayout`(2단 셸)과 별개 — `Sidebar`는 단독 배치 가능한 nav 메뉴 컴포넌트.
items: `{label, href, active, count, icon, section}`, `section:true`는 소제목.

### 반응형(n-screen) 대응 (2026-07-11)

인라인 스타일은 `@media`를 못 쓰므로, 레이아웃 컴포넌트(Grid/Split/SidebarLayout/
Header)는 열 구조를 **CSS 커스텀 속성**(`--ds-grid-cols`/`--ds-split-cols`/
`--ds-sidebar-w`)으로 넘기고 className(`ds-grid`/`ds-split`/`ds-sidebar-layout`/
`ds-header__inner`·`ds-header__nav`)을 답니다. 반응형 규칙은 새 파일
**`tokens/layout.css`**에 있고 `styles.css`가 `@import`합니다(업로드 클로저 포함).
브레이크포인트: 640px(레이아웃 스택), 520px(그리드 1열). 데스크톱 렌더는 불변,
모바일에서만 단일 열로 접힘. 컴포넌트를 추가할 때 반응형이 필요하면 인라인
grid-template 대신 이 패턴(커스텀 속성 + layout.css 규칙)을 따르세요.

### index.html 갤러리 개선 (2026-07-11)

- **파운데이션 탭** 추가: `guidelines/*.html` 견본을 각 파일 첫 줄 `@dsCard`(group/name/
  subtitle/viewport)로 파싱해 그룹별(Colors/Brand/Spacing/Type)로 iframe. `build.mjs`
  main()에서 `readdirSync(OUT/guidelines)`로 수집해 `galleryHtml(promptHead, foundations)`에 전달.
- **스크롤스파이**: IntersectionObserver로 현재 섹션의 사이드바 항목을 하이라이트(.active).
- **카드 액션**: 각 컴포넌트 카드에 카테고리 칩 + viewport 라벨 + ↗(새 탭에서 열기) 링크.
- **모바일 사이드바**: 720px 이하에서 ☰ 토글 → off-canvas 사이드바 + backdrop(기존엔 숨김만 했음).
- 탭: 파운데이션 · 컴포넌트(기본) · **예제 · 화면**(예제 조합 + 화면을 한 탭으로 병합,
  본문/사이드바 모두 "예제 조합"·"화면" 두 그룹으로 구분). `patternsView`/`menuPatterns`
  가 EXAMPLES + SCREENS를 함께 렌더링(view id `patterns`).

모두 기존 방식(self-contained `.jsx`, 인라인 스타일 + `var(--*)` 토큰)으로 작성했고
`.d.ts` + 한국어 `.prompt.md`를 함께 만들었습니다. 데모는 전부 `build.mjs`의
`AUTHORED_DEMOS`에 있습니다(신규 컴포넌트는 `.card.html`이 없음).

`build.mjs` 변경점:
- `GROUP_LABELS`로 그룹별 한국어 라벨을 `@dsCard group=`에 사용(폼/피드백/오버레이/
  데이터/디스플레이/레이아웃/네비게이션) → DS 패널·갤러리 메뉴가 카테고리로 구분됨.
- `EXAMPLES` 3종(예제 조합) → `ds-bundle/examples/*.html` 자체 완결 페이지로 생성.
- `galleryHtml()` → `ds-bundle/index.html` 갤러리(카테고리 메뉴 + 컴포넌트 그리드 +
  예제 조합 뷰). 서버 구동 후 **`/index.html`로 열기**(http-serve는 bare `/`를
  index.html로 매핑하지 않음).

주의:
- `index.html`과 `examples/`는 **로컬 갤러리 전용**으로, DS 프로젝트 업로드 대상이
  아닙니다(표준 업로드 레이아웃에 없음). DS 패널은 `@dsCard` 그룹으로 자체 분류합니다.
  나중에 업로드하려면 finalize_plan writes에 `index.html`, `examples/**`를 추가하세요.
- 예제 조합(`examples/`)은 `package-validate`의 렌더 체크 대상이 아닙니다(components/만
  검사). 수동으로 스크린샷 확인함.

## 참고: 프로젝트 재생성 (2026-07-11)

원래 프로젝트(39540855-…)가 업로드 후 404/목록에서 사라짐(삭제 또는 세션 신원 변경
추정). 새 프로젝트 **81ed2971-390c-4687-95a5-20767615d728**를 만들어 config의
projectId를 갱신함. **2026-07-11 최종 37개 컴포넌트 버전을 이 프로젝트에 업로드 완료**
(incremental path, 168개 파일 + 센티넬 + _ds_sync.json). 갤러리(index.html/examples/
screens)는 로컬 전용이라 업로드 제외.

## 참고: 문서 한글화 (2026-07-11)

사용자 요청으로 모든 `.md` 파일을 한글화했습니다: 저장소의 `README.md`,
`design-system-readme.md`, `SKILL.md`, 7개의 `components/**/*.prompt.md`,
그리고 `.design-sync/conventions.md`, 이 `NOTES.md`. 코드 블록, 토큰 이름, hex 값,
파일 경로, 컴포넌트/prop 이름은 그대로 두고 산문만 번역했습니다. `.prompt.md`,
`conventions.md`, `README.md`는 번들로 업로드되므로 재빌드 후 DS 프로젝트에 재업로드했습니다.
