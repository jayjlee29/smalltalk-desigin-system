# Handoff: Smalltalk Community Design System

## Overview
This package is a **design system reference**, reverse-engineered from your existing `frontend/` Next.js codebase (Tailwind CSS v4, Geist font). It formalizes the visual language your app already uses — colors, type, spacing, radii, and repeating UI patterns (buttons, inputs, badges, tables, pagination, cards) — into token files, component references, and two click-through UI kit recreations (Community board flow + Portfolio dashboard).

## About the design files
The files in this bundle are **design references built as static HTML/JSX**, not production code to import directly. They exist to document, at pixel-level precision, patterns that are currently scattered as repeated Tailwind className strings across your components. The task for implementation is: **use these token values and component specs to factor your existing Tailwind classNames into a shared set of primitives** (or confirm your inline Tailwind approach already matches — in which case this package is documentation, not a migration).

Since your codebase already has this visual language live in production, there is no visual gap to close — the deliverable is *consistency infrastructure*: shared `Button`/`Input`/`Badge`/`Table`/`Pagination`/`Card` components so future screens don't re-derive the same Tailwind strings ad hoc.

## Fidelity
**High-fidelity.** Every token (colors, spacing, radii, type scale) and every component spec below was extracted directly from your `frontend/src` files (Tailwind classNames, inline logic, Recharts config) — nothing was invented. See "Source mapping" below for exact file references.

## Design tokens

### Colors (Tailwind default palette — your app already uses Tailwind's defaults verbatim, no custom theme overrides)
- Neutrals: white `#ffffff`, gray-50 `#f9fafb` → gray-900 `#111827` (10-step scale)
- Accent: blue-600 `#2563eb` (primary actions, links, active states), blue-700 `#1d4ed8` (hover), blue-500 `#3b82f6` (focus ring, "loss" stock color)
- Danger/gain: red-500 `#ef4444` (destructive actions AND stock gains — KR convention: red=up)
- Success/enabled: green-600 `#16a34a`
- Account-type badges: purple-700 `#7e22ce` (연금저축), orange-700 `#c2410c` (IRP), green-700 `#15803d` (ISA)
- Chart categorical palette: `#3b82f6 #10b981 #f59e0b #ef4444 #8b5cf6 #ec4899 #06b6d4 #84cc16`, total line `#1e293b`

### Typography
- Font: **Geist** (UI/body), **Geist Mono** (tabular numeric columns — prices, quantities, percentages)
- Scale: 12 / 14 / 16 / 18 / 24px only — no display type
- Weights: 400 regular, 500 medium, 600 semibold, 700 bold

### Spacing & layout
- Tailwind default scale: 4/8/12/16/24/32/40/64/80px
- Content column: `max-w-3xl` (768px); auth forms: `max-w-sm` (384px)
- Sticky header: 56px (`h-14`)

### Radius
- 4px default, **8px (`rounded-lg`) is the dominant radius** — buttons, inputs, list containers
- 12px (`rounded-xl`) reserved for elevated cards (portfolio summary/account panels)
- Full/9999px for pills (status badges, pagination buttons)

### Shadows
- Almost none. `shadow-sm` only on hovered account cards. `shadow-lg` only on toast notifications. Resting UI is flat — don't add shadows elsewhere.

## Components (source-mapped)

| Component | Source pattern (file) | Key states |
|---|---|---|
| **Button** | Repeated `bg-blue-600 hover:bg-blue-700` / `border hover:bg-gray-50` / `bg-red-500 hover:bg-red-600` strings across `Header.tsx`, `login/page.tsx`, `register/page.tsx`, `CommentSection.tsx` | primary / secondary / danger / ghost; disabled → opacity 0.5 |
| **Input** | `border rounded-lg px-3 py-2(.5) text-sm focus:ring-2 focus:ring-blue-500` in `login/page.tsx`, `register/page.tsx`, `CommentSection.tsx` | default, focus (2px blue ring), error (red-400 border + message) |
| **Badge** | Board 활성/비활성 pill in `BoardList.tsx`; `AccountTypeBadge` in `PortfolioSummaryCard.tsx`; tag pills in `articles/[id]/page.tsx` | tone: blue/gray/green/purple/orange; pill vs. squared |
| **Table** | `SnapshotHoldingsTable.tsx` — `border rounded-xl overflow-hidden` + `thead bg-gray-50` | right-aligned numeric columns, tabular-nums, hover row |
| **Pagination** | Identical numbered-button block in `BoardList.tsx` and `boards/[id]/page.tsx` | active = solid blue-600; inactive = bordered, hover:bg-gray-50 |
| **Card** | `PortfolioSummaryCard.tsx` — gradient hero panel + elevated account cards | gradient (hero only), elevated + hoverable (account cards) |
| **Toast** | `Toast.tsx` — bottom-right stack, 4s auto-dismiss | error (red-500) / success (green-600) / info (gray-700) |

**Signature interaction pattern** (unique to this app — preserve when building new screens): board/article list rows **invert to solid blue-600 with white text on hover** (`BoardList.tsx` `BoardRow`, `boards/[id]/page.tsx` article rows) — not a subtle tint like typical hover states.

## Content & tone
- All copy is Korean, plain/functional, no marketing voice, no emoji, no exclamation points
- Empty/loading/error states always get a one-line gray-400 sentence (never blank space)
- Currency: 만/억 Korean unit formatting, always suffixed `원`; percentages always show explicit `+`/`-` sign
- Timestamps: truncated ISO (`2026-07-10`), never relative

## Iconography
**No icon system exists in the source** — no icon font, SVG set, or PNGs. Only a plain Unicode `♥` (like button) and `←` (back nav) appear. If new screens need icons, introduce one CDN set (e.g. Lucide) matching the plain/functional tone, and note it as an intentional addition — don't invent icons ad hoc per screen.

## Assets
No logo file exists anywhere in the codebase — the "logo" is the plain-type string `Smalltalk Community` (`font-bold text-gray-900`) in the header. Don't introduce a logo mark without one being supplied.

## Files in this package
- `readme.md` — full design system documentation (this content, expanded)
- `styles.css` + `tokens/*.css` — CSS custom properties for every token above
- `components/` — reference React implementations (`.jsx`) + prop contracts (`.d.ts`) + usage docs (`.prompt.md`) for Button, Input, Badge, Table, Pagination, Card, Toast
- `guidelines/*.html` — visual specimen cards (colors, type, spacing, radius, hover pattern)
- `ui_kits/community/index.html` — click-through recreation: board list → board detail → article detail w/ nested comments → login/register
- `ui_kits/portfolio/index.html` — click-through recreation: portfolio summary + account cards + holdings table + trend chart
- `SKILL.md` — drop this whole folder into `.claude/skills/smalltalk-community-design/` in your frontend repo so Claude Code auto-loads this system when working on the app

## Suggested integration path
1. Copy `tokens/*.css` values into a Tailwind v4 `@theme` block (or keep as plain CSS custom properties alongside Tailwind) so `--blue-600` etc. become the single source of truth instead of bare Tailwind utility literals.
2. Extract the 7 components above into `src/components/ui/` using the provided `.jsx` files as a starting structure, adapted to your TypeScript conventions.
3. Replace repeated inline Tailwind strings (e.g. the button classNames duplicated across `Header.tsx`, `login/page.tsx`, `register/page.tsx`) with the shared components.
4. Keep the row-inverts-to-blue-600 hover pattern and Korean content conventions documented above for any new screens.
