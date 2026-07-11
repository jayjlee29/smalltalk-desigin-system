// Off-script design-sync builder for smalltalk-design-system.
//
// This repo has no npm package / dist / Storybook — the components are
// hand-authored self-contained React (.jsx) using inline styles + CSS-var
// tokens. The standard converter (package-build.mjs) can't run, so this
// script produces the exact upload layout by hand, reusing the converter's
// OWN library functions so the output is byte-compatible with the
// claude.ai/design self-check:
//   - bundleToIife + stampHeader  → _ds_bundle.js (+ @ds-bundle header)
//   - vendorReact                 → _vendor/react.js (+ react-dom.js stub)
//   - styleShaFor/renderHashFor/… → _ds_sync.json anchor
//
// Cards are self-contained: each component's demo JSX (taken verbatim from
// the repo's own .card.html, or authored here for the interaction-driven
// ToastProvider) is transformed to plain React.createElement JS via esbuild
// (no Babel), so the card only needs _vendor/react.js + _ds_bundle.js.
//
// Run:  node .design-sync/build.mjs        (from repo root)
// Gate: node .ds-sync/package-validate.mjs ./ds-bundle

import { createHash } from 'node:crypto';
import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

import { bundleToIife, stampHeader } from '../.ds-sync/lib/bundle.mjs';
import { vendorReact, emitReviewPage } from '../.ds-sync/lib/emit.mjs';
import {
  auxShaFor, renderHashFor, scriptsShaFor, styleShaFor, KEY_RECIPE,
} from '../.ds-sync/lib/sync-hashes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'ds-bundle');
const NM = join(ROOT, '.ds-sync', 'node_modules');
const cfg = JSON.parse(readFileSync(join(ROOT, '.design-sync', 'config.json'), 'utf8'));
const GLOBAL = cfg.globalName;
const PKG = cfg.pkg;

// name = the exported identifier (must exist on window.<GLOBAL> — the
// [BUNDLE_EXPORT] smoke check requires it). group = the on-disk folder.
// exports = what the synth entry re-exports from src (Toast ships a Provider
// + hook, so its canonical component name is ToastProvider).
const COMPONENTS = [
  { name: 'Button',        group: 'forms',      src: 'components/forms/Button.jsx',           dts: 'components/forms/Button.d.ts',        prompt: 'components/forms/Button.prompt.md',        card: 'components/forms/button.card.html',        viewport: '700x220', exports: ['Button'] },
  { name: 'Input',         group: 'forms',      src: 'components/forms/Input.jsx',            dts: 'components/forms/Input.d.ts',         prompt: 'components/forms/Input.prompt.md',         card: 'components/forms/input.card.html',         viewport: '700x220', exports: ['Input'], rootStyle: 'padding:20px;background:#fff;font-family:var(--font-sans);max-width:640px' },
  { name: 'Card',          group: 'layout',     src: 'components/layout/Card.jsx',            dts: 'components/layout/Card.d.ts',         prompt: 'components/layout/Card.prompt.md',         card: 'components/layout/card.card.html',         viewport: '700x260', exports: ['Card'] },
  { name: 'Badge',         group: 'feedback',   src: 'components/feedback/Badge.jsx',          dts: 'components/feedback/Badge.d.ts',       prompt: 'components/feedback/Badge.prompt.md',      card: 'components/feedback/badge.card.html',       viewport: '700x160', exports: ['Badge'] },
  { name: 'ToastProvider', group: 'feedback',   src: 'components/feedback/Toast.jsx',          dts: 'components/feedback/Toast.d.ts',       prompt: 'components/feedback/Toast.prompt.md',      card: null,                                        viewport: '520x260', exports: ['ToastProvider', 'useToast'], rootStyle: 'padding:20px;background:#fff;font-family:var(--font-sans);min-height:200px;position:relative' },
  { name: 'Table',         group: 'data',       src: 'components/data/Table.jsx',             dts: 'components/data/Table.d.ts',          prompt: 'components/data/Table.prompt.md',          card: 'components/data/table.card.html',          viewport: '700x220', exports: ['Table'] },
  { name: 'Pagination',    group: 'navigation', src: 'components/navigation/Pagination.jsx',  dts: 'components/navigation/Pagination.d.ts', prompt: 'components/navigation/Pagination.prompt.md', card: 'components/navigation/pagination.card.html', viewport: '520x110', exports: ['Pagination'] },
];

// Interaction-driven components whose visible output only appears after a
// call — authored to render the REAL exported component (never a static
// lookalike). ToastProvider mounts a child that fires toasts on mount.
const AUTHORED_DEMOS = {
  ToastProvider: `
const { ToastProvider, useToast } = window.SmalltalkDS;
function Fire() {
  const { addToast } = useToast();
  React.useEffect(() => {
    addToast("비밀번호가 틀렸습니다", "error");
    addToast("댓글이 등록되었습니다", "success");
    addToast("새 알림이 도착했습니다", "info");
  }, []);
  return (
    <div style={{fontSize:14, color:"var(--gray-600)", lineHeight:1.6}}>
      <div style={{fontWeight:600, color:"var(--gray-900)", marginBottom:4}}>토스트 알림</div>
      화면 우측 하단에 쌓이며 4초 후 자동으로 사라집니다.
    </div>
  );
}
function Demo() {
  return <ToastProvider><Fire/></ToastProvider>;
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));
`.trim(),
};

const rd = (p) => readFileSync(join(ROOT, p), 'utf8');

// Pull the demo JSX out of the repo's own <script id="app-src"> card (verbatim
// — ship what the customer built), or use an authored demo for cards the repo
// mocked statically.
function demoFor(c) {
  if (AUTHORED_DEMOS[c.name]) return AUTHORED_DEMOS[c.name];
  const html = rd(c.card);
  const m = /<script[^>]*id="app-src"[^>]*>([\s\S]*?)<\/script>/.exec(html);
  if (!m) throw new Error(`no app-src demo found in ${c.card} for ${c.name}`);
  return m[1].trim();
}

async function main() {
  // Clean output.
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(join(OUT, '_vendor'), { recursive: true });

  // 1) Synth entry re-exporting every component from src, bundled to an IIFE
  //    at window.<GLOBAL>. reactShim externalizes react → window.React.
  const entry = join(ROOT, '.ds-sync', '.synth-entry.jsx');
  const entrySrc = COMPONENTS.map((c) =>
    `export { ${c.exports.join(', ')} } from ${JSON.stringify(join(ROOT, c.src))};`).join('\n') + '\n';
  writeFileSync(entry, entrySrc);
  await bundleToIife({ entry, globalName: GLOBAL, nodePaths: NM, out: OUT });

  // 2) Vendor React (+ ReactDOM) UMD into _vendor/.
  await vendorReact({ nodeModules: NM, out: OUT });

  // 3) Styling: styles.css + tokens/ (verbatim from the repo). Components
  //    self-style via inline styles + these var(--*) tokens, so there is no
  //    _ds_bundle.css — the token defs in the styles.css @import closure are
  //    the whole styling surface a rendered design receives.
  cpSync(join(ROOT, 'styles.css'), join(OUT, 'styles.css'));
  cpSync(join(ROOT, 'tokens'), join(OUT, 'tokens'), { recursive: true });

  // 4) Guidelines (the repo's own design-guideline pages).
  if (existsSync(join(ROOT, 'guidelines'))) {
    cpSync(join(ROOT, 'guidelines'), join(OUT, 'guidelines'), { recursive: true });
  }

  // 5) Per-component dirs: <Name>.jsx stub, <Name>.d.ts, <Name>.prompt.md,
  //    <Name>.html (self-contained card).
  for (const c of COMPONENTS) {
    const dir = join(OUT, 'components', c.group, c.name);
    mkdirSync(dir, { recursive: true });

    // .jsx — same one-line re-export stub the converter emits.
    writeFileSync(join(dir, `${c.name}.jsx`),
      `// Re-export of ${PKG} ${c.name}. Implementation is in the root _ds_bundle.js (window.${GLOBAL}).\n` +
      `Object.assign(window, { ${c.name}: window.${GLOBAL}.${c.name} });\n`);

    // .d.ts / .prompt.md — verbatim from the repo (hand-authored contracts).
    writeFileSync(join(dir, `${c.name}.d.ts`), rd(c.dts));
    writeFileSync(join(dir, `${c.name}.prompt.md`), rd(c.prompt));

    // .html — self-contained card. Demo JSX → plain JS via esbuild (no Babel).
    const demoJs = (await esbuild.transform(demoFor(c), { loader: 'jsx' })).code;
    const rootStyle = c.rootStyle ?? 'padding:20px;background:#fff;font-family:var(--font-sans)';
    writeFileSync(join(dir, `${c.name}.html`),
`<!-- @dsCard group="Components" viewport="${c.viewport}" name="${c.name}" -->
<!doctype html>
<html><head><meta charset="utf-8">
  <link rel="stylesheet" href="../../../styles.css">
  <style>body{margin:0;background:#fff}</style>
</head><body>
  <div id="root" style="${rootStyle}"></div>
  <script src="../../../_vendor/react.js"></script>
  <script src="../../../_vendor/react-dom.js"></script>
  <script src="../../../_ds_bundle.js"></script>
  <script>
${demoJs}
  </script>
</body></html>
`);
  }

  // 6) README = conventions header (if authored) + the repo's design-reference
  //    README. stampHeader-style header prepend happens via readmeHeader.
  const repoReadme = rd('README.md');
  const convPath = join(ROOT, '.design-sync', 'conventions.md');
  const header = cfg.readmeHeader && existsSync(join(ROOT, cfg.readmeHeader))
    ? readFileSync(join(ROOT, cfg.readmeHeader), 'utf8').trimEnd() + '\n\n---\n\n'
    : (existsSync(convPath) ? readFileSync(convPath, 'utf8').trimEnd() + '\n\n---\n\n' : '');
  writeFileSync(join(OUT, 'README.md'), header + repoReadme);

  // 7) Local build metadata + upload fence sentinel (not part of _ds_sync).
  writeFileSync(join(OUT, '.ds-build-meta.json'), JSON.stringify({
    namespace: GLOBAL, source: PKG, shape: 'package', provider: null,
    componentCount: COMPONENTS.length, skippedStoryIds: [], runtimeFontPrefixes: [],
  }, null, 2) + '\n');
  writeFileSync(join(OUT, '_ds_needs_recompile'), JSON.stringify({ by: 'design-sync-cli' }));

  // 8) Header on the bundle (must come AFTER per-component files exist —
  //    stampHeader hashes each components/<group>/<Name>/<Name>.{jsx,d.ts,prompt.md}).
  const bundleJs = join(OUT, '_ds_bundle.js');
  stampHeader(bundleJs, {
    namespace: GLOBAL,
    components: COMPONENTS.map((c) => ({ name: c.name, group: c.group })),
    inlinedExternals: [],
  });

  // 9) _ds_sync.json anchor.
  const bundleSha12 = createHash('sha256').update(readFileSync(bundleJs)).digest('hex').slice(0, 12);
  const renderHashes = {};
  for (const c of COMPONENTS) renderHashes[c.name] = renderHashFor(OUT, { name: c.name, group: c.group }, {});
  const sourceHashes = Object.fromEntries(COMPONENTS.flatMap((c) => {
    const base = `components/${c.group}/${c.name}/${c.name}`;
    return ['.jsx', '.d.ts', '.prompt.md'].map((ext) => base + ext)
      .filter((rel) => existsSync(join(OUT, rel)))
      .map((rel) => [rel, createHash('sha256').update(readFileSync(join(OUT, rel))).digest('hex').slice(0, 12)]);
  }));
  writeFileSync(join(OUT, '_ds_sync.json'), JSON.stringify({
    shape: 'package',
    keyRecipe: KEY_RECIPE,
    styleSha: styleShaFor(OUT, { includeBundleBody: true }),
    bundleSha12,
    renderHashes,
    sourceHashes,
    auxSha: auxShaFor(OUT),
    scriptsSha: scriptsShaFor(),
  }, null, 2) + '\n');

  // 10) Local human-review page (dot-prefixed → never uploaded).
  emitReviewPage({ OUT, components: COMPONENTS.map((c) => ({ name: c.name, group: c.group })) });

  console.error(`\n✓ built ds-bundle/ — ${COMPONENTS.length} components, bundleSha ${bundleSha12}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
