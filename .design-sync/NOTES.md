# design-sync notes — smalltalk-design-system

## This repo is OFF-SCRIPT (no npm package / dist / Storybook)

The standard converter (`package-build.mjs` / `resync.mjs`) **cannot run** here:
there is no `package.json`, no built `dist/`, and no Storybook. The components are
hand-authored, self-contained React (`.jsx`) using inline styles + CSS-var tokens.

The build is done by a committed off-script script: **`.design-sync/build.mjs`**.
It reuses the converter's own library functions (`lib/bundle.mjs` `bundleToIife`
+ `stampHeader`, `lib/emit.mjs` `vendorReact`/`emitReviewPage`,
`lib/sync-hashes.mjs`) so the output layout is byte-compatible with the
claude.ai/design self-check. The gate is still `package-validate.mjs` (it must
exit 0), and it does.

### How to re-build / re-sync (from repo root)

```sh
# 1. Re-stage the skill scripts (they live in gitignored .ds-sync/)
SB="<design-sync skill base dir>"
mkdir -p .ds-sync && cp -r "$SB"/package-*.mjs "$SB"/resync.mjs "$SB"/lib "$SB"/storybook .ds-sync/
echo '{"name":"ds-sync-deps","private":true}' > .ds-sync/package.json
(cd .ds-sync && npm i esbuild react@18 react-dom@18 typescript playwright && npx playwright install chromium)

# 2. Recreate the fork symlink so build.mjs can resolve esbuild
ln -sfn ../.ds-sync/node_modules .design-sync/node_modules

# 3. Build + gate
node .design-sync/build.mjs
node .ds-sync/package-validate.mjs ./ds-bundle
```

Then upload with the `DesignSync` tool per the skill's §5 (atomic path on re-sync
into the now-populated project). `_ds_sync.json` IS produced, but no driver
consumes it here, so re-sync effectively re-verifies everything (cheap: 7 cards).

## Component name mapping

- The repo's "Toast" component is uploaded as **`ToastProvider`** — that's the
  real bundle export (`ToastProvider` + `useToast` hook). The `[BUNDLE_EXPORT]`
  smoke check requires every listed component name to be a real `window.*` export,
  and there is no `Toast` export. `Toast.d.ts`/`Toast.prompt.md` are copied to
  `ToastProvider.*` in the bundle.

## Cards

- Cards are self-contained: each demo JSX is taken verbatim from the repo's own
  `<script id="app-src">` in `components/**/*.card.html`, transformed to plain
  `React.createElement` JS via esbuild (no Babel), and inlined. React loads from
  `_vendor/react.js`.
- **ToastProvider** is the one authored demo (the repo's original toast card was a
  static HTML mock). It renders the REAL `ToastProvider` + a child that fires three
  toasts (error/success/info) on mount via `useToast`. Toasts are `position:fixed`
  bottom-right, so in `package-validate`'s 1200×800 screenshot they sit in the page
  corner (correct behavior); in the DS pane they anchor to the card iframe.

## Known render characteristics (not defects)

- `[FONT_REMOTE]` for **Geist / Geist Mono**: fonts load from Google Fonts via a
  remote `@import` in `tokens/fonts.css`. In headless Chromium (no network) the
  render-check screenshots fall back to system fonts — expected. The real DS pane
  loads Geist. Do NOT chase this as a font-missing issue.
- `_ds_bundle.css` is intentionally absent: components self-style with inline
  styles reading `var(--*)` tokens; the tokens (in the `styles.css` @import
  closure) are the whole styling surface a rendered design receives. No
  `[CSS_BUNDLE_UNREACHABLE]` because there is no component CSS file.
- `.d.ts` parse check "skipped — typescript not in node_modules": best-effort;
  the `.d.ts` are the repo's hand-authored, valid TS. Install `typescript` in
  `.ds-sync` to enable it.

## Re-sync risks (what can silently go stale)

- **The off-script builder is bespoke.** If the skill's `lib/bundle.mjs`,
  `lib/emit.mjs`, or `lib/sync-hashes.mjs` change their signatures, `build.mjs`
  may break — it imports `bundleToIife`, `stampHeader`, `vendorReact`,
  `emitReviewPage`, `styleShaFor`, `renderHashFor`, `auxShaFor`, `scriptsShaFor`,
  `KEY_RECIPE`. Diff against the current lib on re-sync.
- **New components** added to the repo must be added to the `COMPONENTS` array in
  `build.mjs` (and, if interaction-driven, given an `AUTHORED_DEMOS` entry). There
  is no auto-discovery.
- **`ui_kits/` is NOT synced.** The repo has `ui_kits/community/index.html` and
  `ui_kits/portfolio/index.html` (full-page click-through mocks). They are not
  components and are excluded from the bundle. Revisit if the DS pane should carry
  full-screen starting-point kits.
- **Fonts are network-fetched** (Google Fonts). If the DS ever self-hosts Geist,
  ship the woff2 + `@font-face` and update `tokens/fonts.css`.
- `_ds_sync.json` is produced but not consumed by any driver here — carried
  verification state is effectively not used; re-verification is cheap at 7 cards.
