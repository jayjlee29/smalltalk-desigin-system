# Smalltalk Community — 디자인 시스템

**Smalltalk Community** 프론트엔드 코드베이스(Next.js 15 + React + Tailwind CSS v4 + Apollo/GraphQL, 로컬 `frontend/`에 첨부)에서 역설계한 디자인 시스템.

## 이 제품은 무엇인가

"Smalltalk Community"(`layout.tsx`의 타이틀: *Smalltalk Community*)는 하나의 셸(전역 헤더 + `max-w-3xl` 콘텐츠 열)을 공유하는 두 개의 표면을 가진 한국어 웹앱입니다:

1. **커뮤니티 게시판** — 전형적인 게시판 제품: 게시판 목록 → 글 목록(페이지 매김 또는 무한 스크롤, 사용자 선택) → 중첩 댓글이 있는 글 상세(비밀번호 보호 수정/삭제, 댓글에 계정 불필요), 좋아요, 태그.
2. **포트폴리오 트래커**(포트폴리오) — 로그인 전용 주식 포트폴리오 대시보드: 다계좌 요약, 수익률이 있는 계좌별 보유 종목 테이블, Recharts를 통한 평가액 추세 차트(선형 + 파이).

인증은 단순 아이디/비밀번호(`register/page.tsx`에서 클라이언트 측으로 bcrypt 스타일 규칙 적용), 세션은 `UserProvider`(`src/lib/user-context.tsx`)를 통해 `localStorage`에 유지됩니다. 데이터 계층은 Apollo Client(`src/lib/apollo-client.ts`)를 통한 GraphQL입니다.

**소스:** `frontend/`에 마운트된 로컬 코드베이스(Next.js App Router). 읽은 주요 파일: `src/app/layout.tsx`, `globals.css`, `src/components/Header.tsx`, `BoardList.tsx`, `CommentSection.tsx`, `Toast.tsx`, `src/app/{login,register}/page.tsx`, `src/app/boards/[id]/page.tsx`, `src/app/articles/[id]/page.tsx`, `src/components/portfolio/{PortfolioSummaryCard,SnapshotHoldingsTable,PortfolioTrendChart}.tsx`, `src/app/portfolio/page.tsx`. Figma 파일은 첨부되지 않았습니다.

## 목차

- `styles.css` — 루트 스타일시트, 아래 모든 토큰을 임포트.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `fonts.css`.
- `guidelines/` — 디자인 시스템 탭에 표시되는 파운데이션 견본 카드(색상, 타입, 간격, 반경).
- `components/`
  - `forms/Button.jsx`, `forms/Input.jsx`
  - `feedback/Badge.jsx`, `feedback/Toast.jsx`
  - `data/Table.jsx`
  - `navigation/Pagination.jsx`
  - `layout/Card.jsx`
- `ui_kits/community/` — 게시판 목록, 게시판/글 목록, 댓글이 있는 글 상세, 로그인, 회원가입.
- `ui_kits/portfolio/` — 포트폴리오 요약 + 보유 종목 테이블 + 추세 차트.
- `assets/` — 제공된 것 없음(아래 아이콘 항목 참고); 소스에 로고 파일이 없어, 마크가 들어갈 자리마다 워드마크를 순수 텍스트로 설정합니다.

## 콘텐츠 기본 원칙

- **언어:** 모든 UI 카피는 한국어, 담백하고 기능적 — 마케팅 어조 없음. 라벨은 명사/짧은 구(`게시판`, `글쓰기`, `댓글`)이며 완전한 문장이 아닙니다.
- **톤:** 중립적, 실용적, 약간 간결 — 소비자 브랜드가 아니라 포럼/유틸리티 도구 같은. 소스 어디에도 느낌표나 이모지 없음.
- **화법:** 한국어 UI 카피에 "당신/나" 프레이밍 불필요; 버튼은 명령형 명사(`로그인`, `회원가입`, `글쓰기`).
- **빈/로딩/에러 상태**는 항상 한 줄짜리 gray-400 문장을 표시, 예: `불러오는 중...`(로딩), `게시판이 없습니다.`(없음), `오류: {message}`(에러) — 빈 공간을 두지 않음.
- **숫자:** 통화는 한국어 만/억 단위 표기(`formatKrw`: ≥1억 → `X.XX억`, ≥1만 → `X만`), 항상 `원` 접미사. 퍼센트는 항상 명시적 부호(`+2.14%`).
- **타임스탬프:** 잘린 ISO 문자열(`createdAt.slice(0,10)` → `2026-07-10`), 상대 표기("3시간 전") 아님.
- **검증 카피**는 구체적이고 안내적(회원가입 페이지): 예를 들어 일반적인 "잘못됨" 대신 정확한 문자 종류 규칙을 설명합니다.

## 시각 파운데이션

- **팔레트:** 순백 배경(`#ffffff`), 모든 중립/텍스트에 Tailwind 기본 **gray** 스케일, 단일 강조색으로 **blue-600**(`#2563eb`)(주요 버튼, 링크, 활성/선택 상태, 포커스 링). **빨강** = 파괴적 액션 및 주가 상승(한국 관례: 수익률에서 빨강=상승, 파랑=하락). **초록** = "활성/사용 가능" 상태 알약. 보라/주황은 계좌 유형 배지 색으로만 등장. 보라-파랑 그라디언트 없음, 장식적 색 없음.
- **타입:** 모든 UI 텍스트에 Geist(sans), 표 형태 숫자 열에는 Geist Mono 함의(가격/수량에 `tabular-nums` 클래스). 스케일은 작고 절제됨: 12/14/16/18/24px 만. 제목은 24px `font-bold`(`text-2xl`), 나머지는 regular/medium/semibold — 디스플레이 타입 없음, 세리프 없음.
- **간격:** 촘촘하고 기능적인 Tailwind 간격(4/8/12/16/24/32px). 단일 콘텐츠 열은 `max-w-3xl`(768px)로 제한; 인증 폼은 `max-w-sm`(384px). 비대칭이거나 넉넉한 여백 없음 — 이것은 밀도 높고 과업 중심의 레이아웃입니다.
- **배경:** 어디나 플랫 화이트. *유일한* 비평면 표면은 포트폴리오 "전체" 요약 패널로, 아주 은은한 `from-gray-50 to-white` 그라디언트를 사용 — 그 하나의 히어로 통계 블록 전용, 다른 곳엔 안 씀. 사진, 일러스트, 패턴/텍스처 없음.
- **테두리 & 카드:** 얇은 1px `gray-200` 테두리가 콘텐츠를 묶는 주된 방식(그림자가 아님). 리스트 컨테이너(`border rounded-lg overflow-hidden divide-y`)가 게시판/글/댓글의 지배적 패턴. 강조 카드(포트폴리오 계좌 카드)는 `rounded-xl` + 테두리, 호버 시에만 `hover:shadow-sm` + `hover:border-blue-400` — 기본 상태는 그림자 없음.
- **모서리 반경:** `rounded-lg`(8px)가 버튼/입력/리스트 컨테이너의 기본. `rounded-xl`(12px)은 포트폴리오의 강조 요약/계좌 카드 전용. `rounded-full`은 상태 알약과 페이지네이션 번호 버튼.
- **호버 상태:** 주요 버튼은 어두워짐(`blue-600`→`blue-700`); 보조/아웃라인 버튼은 옅은 회색 채움(`hover:bg-gray-50`); 리스트 행(게시판 행, 글 행)은 호버 시 **채워진 `blue-600` + 흰 텍스트로 반전** — 이 앱 고유의 단호한 패턴이며 은은한 틴트가 아님; 파괴적 호버는 주요 버튼과 같은 방식으로 빨강이 어두워짐.
- **누름/비활성 상태:** 비활성 버튼은 `opacity-50`으로 떨어짐; 소스 어디에도 별도의 "눌림" 축소/스케일 효과 없음 — 인터랙션 피드백은 순전히 색 기반.
- **전환:** 모든 인터랙티브 요소가 Tailwind의 헐벗은 `transition` 클래스(150ms 기본 이징)를 지님 — 일관되고 은은하며 튀거나 화려하지 않음.
- **그림자:** 거의 없음. `shadow-sm`은 호버된 계좌 카드에만; `shadow-lg`는 토스트 알림에만. 기본 UI는 플랫.
- **포커스 상태:** 입력은 `focus:ring-2 focus:ring-blue-500`(보이는 파란 링)을 받음, 테두리 색만 바꾸는 것이 아님.
- **데이터 시각화:** 고정 범주형 팔레트(`#3b82f6,#10b981,#f59e0b,#ef4444,#8b5cf6,#ec4899,#06b6d4,#84cc16`), 얇은 격자선(`#f0f0f0`), 11px 축 눈금, 실선 주/합계선 대비 파선 보조선을 쓰는 Recharts 선/파이 차트.
- **레이아웃:** 단일 고정 헤더(`border-b`, 흰색, `z-10`), 하나의 중앙 콘텐츠 열 — 사이드바 없음, 패널형 대시보드 없음. 로딩 상태는 스피너가 아니라 최종 콘텐츠 형태에 맞춘 회색 `animate-pulse` 스켈레톤 블록 사용.
- **투명도/블러:** 소스 어디에도 사용되지 않음.

## 아이콘

소스는 **아이콘 시스템을 전혀 쓰지 않습니다** — 아이콘 폰트, SVG 아이콘 세트, PNG 아이콘 없음. 발견된 유일한 비텍스트 글리프는 좋아요 버튼의 순수 유니코드 하트(`♥`)와 뒤로 가기의 텍스트 화살표(`←`)뿐이며, 둘 다 카피에 직접 설정됨. 이모지는 어디에도 사용 안 됨. 이 시스템 위에 만든 디자인에 실제 아이콘이 필요하면, 단일 CDN 아이콘 세트(예: 앱의 담백/기능적 톤에 맞는 Lucide)를 도입하고 그 대체를 문서화하세요 — 복사해 쓸 것이 원래 존재하지 않습니다.

## 에셋

첨부된 코드베이스 어디에도 로고 파일이 없습니다 — "로고"는 말 그대로 헤더의 텍스트 문자열 `Smalltalk Community`(`font-bold text-gray-900`)입니다. 이 디자인 시스템은 마크가 들어갈 자리마다 워드마크를 순수 텍스트로 렌더링하며 로고 마크를 지어내지 않습니다. 소스에는 일러스트, 사진, 배경 이미지도 없습니다.

## 의도적 추가

소스는 컴포넌트 라이브러리가 아니라 코드베이스입니다 — Tailwind 유틸리티 클래스가 명명된 프리미티브로 정리되지 않고 인라인으로 반복됩니다. 다음 프리미티브들은 정확한 클래스 조합이 파일 전반에서 4회 이상 그대로 반복되기에 추출한 것입니다(관례로 지어낸 것이 아님):
- **Button** — primary(`bg-blue-600` / 호버 `blue-700`), secondary/outline(`border` / 호버 `bg-gray-50`), danger(`bg-red-500` / 호버 `red-600`) 변형, 모두 Header, 폼, 댓글, 글에서 반복 확인됨.
- **Input** — `border rounded-lg px-3 py-2(.5) text-sm focus:ring-2 focus:ring-blue-500` 패턴, 로그인/회원가입/댓글 폼 전반에서 반복.
- **Badge** — 상태 알약 패턴(게시판 활성/비활성, 계좌 유형 색, 글 태그).
- **Table** — 보유 종목 테이블 구조(`border rounded-xl overflow-hidden` + `thead bg-gray-50`).
- **Pagination** — `BoardList`와 게시판 글 목록에 동일하게 반복되는 번호 버튼 행.
- **Card** — 포트폴리오 패널에 쓰이는 `border rounded-xl p-{5,6}` 컨테이너.

이 목록 외의 컴포넌트는 추가되지 않았습니다.
