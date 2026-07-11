# 핸드오프: Smalltalk Community 디자인 시스템

## 개요
이 패키지는 기존 `frontend/` Next.js 코드베이스(Tailwind CSS v4, Geist 폰트)에서 역설계한 **디자인 시스템 레퍼런스**입니다. 앱이 이미 사용하고 있는 시각 언어 — 색상, 타이포, 간격, 반경, 반복되는 UI 패턴(버튼, 입력, 배지, 테이블, 페이지네이션, 카드) — 을 토큰 파일, 컴포넌트 레퍼런스, 그리고 두 개의 클릭형 UI 킷 재현본(커뮤니티 게시판 플로우 + 포트폴리오 대시보드)으로 정형화합니다.

## 디자인 파일에 관하여
이 번들의 파일들은 직접 임포트해 쓰는 프로덕션 코드가 아니라, **정적 HTML/JSX로 만든 디자인 레퍼런스**입니다. 현재 여러 컴포넌트에 흩어져 반복되는 Tailwind className 문자열들을 픽셀 단위 정밀도로 문서화하기 위해 존재합니다. 구현 시 과제는 이것입니다: **이 토큰 값과 컴포넌트 스펙을 사용해, 기존 Tailwind className을 공유 프리미티브 집합으로 정리하기**(또는 인라인 Tailwind 방식이 이미 일치함을 확인 — 그렇다면 이 패키지는 마이그레이션이 아니라 문서입니다).

코드베이스에 이미 이 시각 언어가 프로덕션에 살아 있으므로 메울 시각적 격차는 없습니다 — 산출물은 *일관성 인프라*입니다: 앞으로의 화면들이 같은 Tailwind 문자열을 매번 다시 도출하지 않도록 하는 공유 `Button`/`Input`/`Badge`/`Table`/`Pagination`/`Card` 컴포넌트.

## 충실도(Fidelity)
**고충실도.** 아래의 모든 토큰(색상, 간격, 반경, 타입 스케일)과 모든 컴포넌트 스펙은 `frontend/src` 파일(Tailwind className, 인라인 로직, Recharts 설정)에서 직접 추출한 것이며 — 지어낸 것은 없습니다. 정확한 파일 참조는 아래 "소스 매핑"을 보세요.

## 디자인 토큰

### 색상 (Tailwind 기본 팔레트 — 앱이 이미 Tailwind 기본값을 그대로 사용, 커스텀 테마 오버라이드 없음)
- 중립: white `#ffffff`, gray-50 `#f9fafb` → gray-900 `#111827` (10단계 스케일)
- 강조: blue-600 `#2563eb` (주요 액션, 링크, 활성 상태), blue-700 `#1d4ed8` (호버), blue-500 `#3b82f6` (포커스 링, 주가 "하락" 색)
- 위험/상승: red-500 `#ef4444` (파괴적 액션 및 주가 상승 — 한국 관례: 빨강=상승)
- 성공/활성: green-600 `#16a34a`
- 계좌 유형 배지: purple-700 `#7e22ce` (연금저축), orange-700 `#c2410c` (IRP), green-700 `#15803d` (ISA)
- 차트 범주형 팔레트: `#3b82f6 #10b981 #f59e0b #ef4444 #8b5cf6 #ec4899 #06b6d4 #84cc16`, 합계선 `#1e293b`

### 타이포그래피
- 폰트: **Geist** (UI/본문), **Geist Mono** (표 형태 숫자 열 — 가격, 수량, 퍼센트)
- 스케일: 12 / 14 / 16 / 18 / 24px 만 — 디스플레이 타입 없음
- 굵기: 400 regular, 500 medium, 600 semibold, 700 bold

### 간격 & 레이아웃
- Tailwind 기본 스케일: 4/8/12/16/24/32/40/64/80px
- 콘텐츠 열: `max-w-3xl` (768px); 인증 폼: `max-w-sm` (384px)
- 고정 헤더: 56px (`h-14`)

### 반경(Radius)
- 4px 기본, **8px (`rounded-lg`)가 지배적인 반경** — 버튼, 입력, 리스트 컨테이너
- 12px (`rounded-xl`)는 강조 카드(포트폴리오 요약/계좌 패널) 전용
- Full/9999px는 알약 모양(상태 배지, 페이지네이션 버튼)

### 그림자
- 거의 없음. `shadow-sm`은 호버된 계좌 카드에만. `shadow-lg`는 토스트 알림에만. 기본 UI는 플랫 — 다른 곳에 그림자를 추가하지 마세요.

## 컴포넌트 (소스 매핑)

| 컴포넌트 | 소스 패턴 (파일) | 주요 상태 |
|---|---|---|
| **Button** | `Header.tsx`, `login/page.tsx`, `register/page.tsx`, `CommentSection.tsx` 전반에 반복되는 `bg-blue-600 hover:bg-blue-700` / `border hover:bg-gray-50` / `bg-red-500 hover:bg-red-600` 문자열 | primary / secondary / danger / ghost; disabled → opacity 0.5 |
| **Input** | `login/page.tsx`, `register/page.tsx`, `CommentSection.tsx`의 `border rounded-lg px-3 py-2(.5) text-sm focus:ring-2 focus:ring-blue-500` | 기본, 포커스(2px 파란 링), 에러(red-400 테두리 + 메시지) |
| **Badge** | `BoardList.tsx`의 게시판 활성/비활성 알약; `PortfolioSummaryCard.tsx`의 `AccountTypeBadge`; `articles/[id]/page.tsx`의 태그 알약 | tone: blue/gray/green/purple/orange; 알약 vs. 사각형 |
| **Table** | `SnapshotHoldingsTable.tsx` — `border rounded-xl overflow-hidden` + `thead bg-gray-50` | 우측 정렬 숫자 열, tabular-nums, 행 호버 |
| **Pagination** | `BoardList.tsx`와 `boards/[id]/page.tsx`에 동일하게 반복되는 번호 버튼 블록 | 활성 = 채워진 blue-600; 비활성 = 테두리, hover:bg-gray-50 |
| **Card** | `PortfolioSummaryCard.tsx` — 그라디언트 히어로 패널 + 강조 계좌 카드 | gradient(히어로 전용), elevated + hoverable(계좌 카드) |
| **Toast** | `Toast.tsx` — 우측 하단 스택, 4초 자동 소멸 | error(red-500) / success(green-600) / info(gray-700) |

**시그니처 인터랙션 패턴** (이 앱 고유 — 새 화면을 만들 때 유지할 것): 게시판/글 목록 행이 **호버 시 채워진 blue-600 + 흰 텍스트로 반전**됩니다(`BoardList.tsx`의 `BoardRow`, `boards/[id]/page.tsx`의 글 행) — 일반적인 호버처럼 은은한 틴트가 아닙니다.

## 콘텐츠 & 톤
- 모든 카피는 한국어, 담백하고 기능적 — 마케팅 어조, 이모지, 느낌표 없음
- 빈/로딩/에러 상태는 항상 한 줄짜리 gray-400 문장을 표시(빈 공간을 두지 않음)
- 통화: 만/억 한국어 단위 표기, 항상 `원` 접미사; 퍼센트는 항상 명시적 `+`/`-` 부호
- 타임스탬프: 잘린 ISO(`2026-07-10`), 상대 표기 아님

## 아이콘
**소스에 아이콘 시스템이 없습니다** — 아이콘 폰트, SVG 세트, PNG 모두 없음. 순수 유니코드 `♥`(좋아요)와 `←`(뒤로 가기)만 등장합니다. 새 화면에 아이콘이 필요하면, 담백/기능적 톤에 맞는 CDN 세트 하나(예: Lucide)를 도입하고 의도적 추가로 기록하세요 — 화면마다 아이콘을 임의로 만들지 마세요.

## 에셋
코드베이스 어디에도 로고 파일이 없습니다 — "로고"는 헤더의 순수 텍스트 문자열 `Smalltalk Community`(`font-bold text-gray-900`)입니다. 제공된 것이 없다면 로고 마크를 도입하지 마세요.

## 이 패키지의 파일
- `readme.md` — 전체 디자인 시스템 문서(이 내용의 확장판)
- `styles.css` + `tokens/*.css` — 위 모든 토큰의 CSS 커스텀 속성
- `components/` — Button, Input, Badge, Table, Pagination, Card, Toast의 레퍼런스 React 구현(`.jsx`) + prop 계약(`.d.ts`) + 사용 문서(`.prompt.md`)
- `guidelines/*.html` — 시각 견본 카드(색상, 타입, 간격, 반경, 호버 패턴)
- `ui_kits/community/index.html` — 클릭형 재현: 게시판 목록 → 게시판 상세 → 글 상세(중첩 댓글) → 로그인/회원가입
- `ui_kits/portfolio/index.html` — 클릭형 재현: 포트폴리오 요약 + 계좌 카드 + 보유 종목 테이블 + 추세 차트
- `SKILL.md` — 이 폴더 전체를 프론트엔드 저장소의 `.claude/skills/smalltalk-community-design/`에 넣으면 앱 작업 시 Claude Code가 이 시스템을 자동 로드합니다

## 권장 통합 경로
1. `tokens/*.css` 값을 Tailwind v4 `@theme` 블록에 복사(또는 Tailwind와 함께 순수 CSS 커스텀 속성으로 유지)하여 `--blue-600` 등이 헐벗은 Tailwind 유틸리티 리터럴 대신 단일 진실 원천이 되게 합니다.
2. 위 7개 컴포넌트를 제공된 `.jsx` 파일을 시작 구조로 삼아 `src/components/ui/`로 추출하고, 팀의 TypeScript 관례에 맞게 조정합니다.
3. 반복되는 인라인 Tailwind 문자열(예: `Header.tsx`, `login/page.tsx`, `register/page.tsx`에 중복된 버튼 className)을 공유 컴포넌트로 교체합니다.
4. 행이 blue-600으로 반전되는 호버 패턴과 위에 문서화된 한국어 콘텐츠 관례를 새 화면에서도 유지합니다.
