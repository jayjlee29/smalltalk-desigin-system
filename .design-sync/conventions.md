# Smalltalk Design System — how to build with it

Korean community-board + stock-portfolio web app. 7 React components on
`window.SmalltalkDS`, styled with **CSS custom-property tokens** (no utility
classes, no Tailwind at runtime, no style-prop system).

## Setup — one stylesheet, no provider needed for styling

```html
<!-- React must be on the page first -->
<link rel="stylesheet" href="styles.css">   <!-- @imports fonts + all tokens -->
<script src="_ds_bundle.js"></script>        <!-- window.SmalltalkDS.* -->
```

`styles.css` is the whole styling surface: it `@import`s Geist/Geist Mono (from
Google Fonts) and every token file. Components self-style with inline styles that
read these tokens — **link `styles.css` and they render on-brand; skip it and
every token resolves to nothing.** There is NO theme provider — the only wrapper
is `ToastProvider`, and only if you use toasts (see below).

## Styling idiom — tokens, not classes

You do not add classes to components; you pass **semantic props**, and you style
your *own* layout glue with `var(--token)`. The tokens mirror the app's Tailwind
default scale but are exposed as CSS custom properties:

| Family | Real token names |
|---|---|
| Color — neutral | `--white`, `--gray-50` … `--gray-900` |
| Color — brand/semantic | `--blue-600` (primary), `--blue-700` (hover), `--red-500` (danger **and** stock gain), `--green-600` (success), `--purple-700`/`--orange-700`/`--green-700` (account-type chips) |
| Color — aliases | `--accent`, `--danger`, `--success`, `--border-default`, `--border-error`, `--text-primary`, `--text-secondary`, `--text-link`, `--surface-subtle` |
| Chart | `--chart-1` … `--chart-8`, `--chart-line-total` |
| Type | `--font-sans` (Geist), `--font-mono` (Geist Mono — use for prices/quantities/percentages), `--text-xs`/`-sm`/`-base`/`-lg`/`-2xl`, `--font-medium`/`-semibold`/`-bold` |
| Spacing | `--space-1` (4px) … `--space-20` (80px), `--content-max-width` (768px), `--form-max-width` (384px), `--header-height` (56px) |
| Radius / elevation | `--radius-default` (4px), `--radius-lg` (8px, the default), `--radius-xl` (12px, elevated cards), `--radius-full` (pills), `--shadow-sm`, `--shadow-lg`, `--transition-default` |

Brand rules worth honoring: **`--radius-lg` (8px) is the dominant radius**; UI is
**flat** (`--shadow-sm` only on hovered cards, `--shadow-lg` only on toasts);
**KR color convention — red = up/gain (`--red-500`), blue = down/loss
(`--blue-500`)**; render numeric/tabular data in `--font-mono`.

## Components (all `window.SmalltalkDS.*`)

- `Button` — `variant` primary/secondary/danger/ghost, `size` sm/md/lg, `disabled`
- `Input` — `label`, `error`, `type` text/password, `placeholder`, `compact`
- `Card` — `elevated`, `hoverable`, `gradient`, `padding`
- `Badge` — `tone` blue/gray/green/purple/orange, `pill`
- `Table` — `columns` (`{key,label,align,width,mono,render}`), `rows`, `rowKey`
- `Pagination` — `page`, `totalPages`, `onChange`
- `ToastProvider` + `useToast` — wrap the app once in `<ToastProvider>`, then
  `useToast().addToast(message, "error"|"success"|"info")` anywhere below

## Where the truth lives

Read before styling: `styles.css` and its `tokens/*.css` (exact token names/values),
`components/<group>/<Name>/<Name>.prompt.md` (usage + variants) and `<Name>.d.ts`
(props), and `guidelines/*.html` (color/type/spacing/radius reference pages).

## One idiomatic snippet

```jsx
const { Card, Badge, Button } = window.SmalltalkDS;
// Library components for the controls; var(--*) tokens for your own layout glue.
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
