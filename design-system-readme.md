# Smalltalk Community — Design System

Design system reverse-engineered from the **Smalltalk Community** frontend codebase (Next.js 15 + React + Tailwind CSS v4 + Apollo/GraphQL), attached locally at `frontend/`.

## What this product is

"Smalltalk Community" (title in `layout.tsx`: *Smalltalk Community*) is a Korean-language web app with two surfaces sharing one shell (global header + `max-w-3xl` content column):

1. **Community boards** — a classic bulletin-board (게시판) product: board list → article list (paged or infinite-scroll, user's choice) → article detail with nested comments (password-protected edit/delete, no accounts needed to comment), likes, tags.
2. **Portfolio tracker** (포트폴리오) — logged-in-only stock portfolio dashboard: multi-account summary, per-account holdings tables with returns, valuation trend charts (line + pie) via Recharts.

Auth is simple username/password (bcrypt-style rules enforced client-side in `register/page.tsx`), session kept in `localStorage` via `UserProvider` (`src/lib/user-context.tsx`). Data layer is GraphQL via Apollo Client (`src/lib/apollo-client.ts`).

**Source:** local codebase mounted at `frontend/` (Next.js App Router). Key files read: `src/app/layout.tsx`, `globals.css`, `src/components/Header.tsx`, `BoardList.tsx`, `CommentSection.tsx`, `Toast.tsx`, `src/app/{login,register}/page.tsx`, `src/app/boards/[id]/page.tsx`, `src/app/articles/[id]/page.tsx`, `src/components/portfolio/{PortfolioSummaryCard,SnapshotHoldingsTable,PortfolioTrendChart}.tsx`, `src/app/portfolio/page.tsx`. No Figma file was attached.

## Index

- `styles.css` — root stylesheet, imports all tokens below.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `fonts.css`.
- `guidelines/` — foundation specimen cards (colors, type, spacing, radius) shown in the Design System tab.
- `components/`
  - `forms/Button.jsx`, `forms/Input.jsx`
  - `feedback/Badge.jsx`, `feedback/Toast.jsx`
  - `data/Table.jsx`
  - `navigation/Pagination.jsx`
  - `layout/Card.jsx`
- `ui_kits/community/` — board list, board/article list, article detail w/ comments, login, register.
- `ui_kits/portfolio/` — portfolio summary + holdings table + trend chart.
- `assets/` — none provided (see Iconography below); no logo file exists in the source, so the wordmark is set in plain type everywhere a mark would go.

## Content fundamentals

- **Language:** All UI copy is Korean, plain and functional — no marketing voice. Labels are nouns/short phrases (`게시판`, `글쓰기`, `댓글`), never full sentences.
- **Tone:** Neutral, utilitarian, slightly terse — like a forum/utility tool, not a consumer brand. No exclamation points, no emoji anywhere in the source.
- **Address:** No "you/I" framing needed in Korean UI copy; buttons are imperative nouns (`로그인` = "Log in", `회원가입` = "Sign up", `글쓰기` = "Write post").
- **Empty/loading/error states** always get a one-line gray-400 sentence, e.g. `불러오는 중...` (loading), `게시판이 없습니다.` (none found), `오류: {message}` (error) — never blank space.
- **Numbers:** Korean 만/억 unit formatting for currency (`formatKrw`: ≥1억 → `X.XX억`, ≥1만 → `X만`), always suffixed with `원`. Percentages always show explicit sign (`+2.14%`).
- **Timestamps:** truncated ISO strings (`createdAt.slice(0,10)` → `2026-07-10`), never relative ("3 hours ago").
- **Validation copy** is specific and instructional (register page): e.g. explains exact character-class rules rather than a generic "invalid".

## Visual foundations

- **Palette:** pure white background (`#ffffff`), Tailwind's default **gray** scale for all neutrals/text, **blue-600** (`#2563eb`) as the single accent (primary buttons, links, active/selected states, focus rings). **Red** = destructive actions AND stock gains (KR convention: red=up, blue=down for returns). **Green** = "enabled/active" status pills. Purple/orange appear only as account-type badge hues. No purple-blue gradients, no decorative color.
- **Type:** Geist (sans) for all UI text, Geist Mono implied for tabular numeric columns (`tabular-nums` class on prices/quantities). Scale is small and restrained: 12/14/16/18/24px only. Headings are `font-bold` at 24px (`text-2xl`), everything else regular/medium/semibold — no display type, no serif.
- **Spacing:** tight, functional Tailwind spacing (4/8/12/16/24/32px). Single content column capped at `max-w-3xl` (768px); auth forms at `max-w-sm` (384px). No asymmetric or generous whitespace — this is a dense, task-focused layout.
- **Backgrounds:** flat white everywhere. The *only* non-flat surface is the portfolio "전체" summary panel, which uses a very subtle `from-gray-50 to-white` gradient — reserved for that one hero stat block, not used elsewhere. No photography, no illustration, no patterns/textures.
- **Borders & cards:** thin 1px `gray-200` borders are the primary way content is grouned (not shadows). List containers (`border rounded-lg overflow-hidden divide-y`) are the dominant pattern for boards/articles/comments. Elevated cards (portfolio account cards) use `rounded-xl` + border, with `hover:shadow-sm` + `hover:border-blue-400` only on hover — resting state has no shadow.
- **Corner radii:** `rounded-lg` (8px) is the default for buttons, inputs, and list containers. `rounded-xl` (12px) is reserved for portfolio's elevated summary/account cards. `rounded-full` for status pills and pagination number-buttons.
- **Hover states:** primary buttons darken (`blue-600`→`blue-700`); secondary/outline buttons get a light gray fill (`hover:bg-gray-50`); list rows (board rows, article rows) **invert to solid `blue-600` with white text** on hover — a distinctive, assertive pattern unique to this app, not a subtle tint; destructive hover darkens red the same way as primary.
- **Press/disabled states:** disabled buttons drop to `opacity-50`; no distinct "pressed" shrink/scale effect anywhere in the source — interaction feedback is purely color-based.
- **Transitions:** every interactive element carries Tailwind's bare `transition` class (150ms default easing) — consistent, subtle, never bouncy or elaborate.
- **Shadows:** almost none. `shadow-sm` only on hovered account cards; `shadow-lg` only on toast notifications. Resting UI is flat.
- **Focus states:** inputs get `focus:ring-2 focus:ring-blue-500` (a visible blue ring), not a border-color-only change.
- **Data viz:** Recharts line/pie charts with a fixed categorical palette (`#3b82f6,#10b981,#f59e0b,#ef4444,#8b5cf6,#ec4899,#06b6d4,#84cc16`), thin gridlines (`#f0f0f0`), 11px axis ticks, dashed secondary lines vs. solid primary/total line.
- **Layout:** single sticky header (`border-b`, white, `z-10`), one central content column — no sidebars, no dashboards-with-panels. Loading states use gray `animate-pulse` skeleton blocks matching final content shape, not spinners.
- **Transparency/blur:** none used anywhere in the source.

## Iconography

The source uses **no icon system at all** — no icon font, no SVG icon set, no PNG icons. The only non-text glyphs found are a plain Unicode heart (`♥`) for the like button and text arrows (`←`) for back-navigation, both set directly in copy. No emoji are used anywhere. If a design built on this system needs real icons, introduce a single CDN icon set (e.g. Lucide, matching the app's plain/functional tone) and document the substitution — none exists natively to copy.

## Assets

No logo file exists anywhere in the attached codebase — the "logo" is literally the text string `Smalltalk Community` (`font-bold text-gray-900`) in the header. This design system renders the wordmark in plain type wherever a mark would go, and does not invent a logo mark. No illustrations, photography, or background imagery exist in the source either.

## Intentional additions

The source is a codebase, not a component library — Tailwind utility classes are repeated inline rather than factored into named primitives. The following primitives were extracted because their exact class combinations repeat ≥4× verbatim across files (not invented from convention):
- **Button** — primary (`bg-blue-600` / hover `blue-700`), secondary/outline (`border` / hover `bg-gray-50`), danger (`bg-red-500` / hover `red-600`) variants, all seen repeated across Header, forms, comments, articles.
- **Input** — the `border rounded-lg px-3 py-2(.5) text-sm focus:ring-2 focus:ring-blue-500` pattern, repeated across login/register/comment forms.
- **Badge** — status pill pattern (board 활성/비활성, account-type colors, article tags).
- **Table** — the holdings table structure (`border rounded-xl overflow-hidden` + `thead bg-gray-50`).
- **Pagination** — the numbered-button row repeated identically in `BoardList` and board article list.
- **Card** — the `border rounded-xl p-{5,6}` container used for portfolio panels.

No components beyond this list were added.
