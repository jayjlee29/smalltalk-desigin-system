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
// Cards are self-contained: each component's demo JSX (from the repo's own
// .card.html, or authored below) is transformed to plain React.createElement
// JS via esbuild (no Babel).
//
// It also emits a local gallery — ds-bundle/index.html — with three views:
//   컴포넌트   component grid, grouped by category
//   예제 조합  small compositions (examples/*.html)
//   화면       full-screen templates (screens/*.html)
// index.html is the served landing page.
//
// Run:  node .design-sync/build.mjs        (from repo root)
// Gate: node .ds-sync/package-validate.mjs ./ds-bundle

import { createHash } from 'node:crypto';
import {
  cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

import { bundleToIife, stampHeader } from '../.ds-sync/lib/bundle.mjs';
import { vendorReact } from '../.ds-sync/lib/emit.mjs';
import {
  auxShaFor, renderHashFor, scriptsShaFor, styleShaFor, KEY_RECIPE,
} from '../.ds-sync/lib/sync-hashes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'ds-bundle');
const NM = join(ROOT, '.ds-sync', 'node_modules');
const cfg = JSON.parse(readFileSync(join(ROOT, '.design-sync', 'config.json'), 'utf8'));
const GLOBAL = cfg.globalName;
const PKG = cfg.pkg;

const GROUP_LABELS = {
  forms: '폼', feedback: '피드백', overlay: '오버레이', data: '데이터', charts: '차트',
  display: '디스플레이', layout: '레이아웃', navigation: '네비게이션',
};
const GROUP_ORDER = ['forms', 'feedback', 'overlay', 'data', 'charts', 'display', 'layout', 'navigation'];

const DEFAULT_ROOT = 'padding:20px;background:#fff;font-family:var(--font-sans)';
const C = (name, group, opts = {}) => ({
  name, group,
  src: `components/${group}/${opts.file ?? name}.jsx`,
  dts: `components/${group}/${opts.file ?? name}.d.ts`,
  prompt: `components/${group}/${opts.file ?? name}.prompt.md`,
  card: opts.card ?? null,
  viewport: opts.viewport ?? '640x220',
  exports: opts.exports ?? [name],
  rootStyle: opts.rootStyle ?? DEFAULT_ROOT,
});

const COMPONENTS = [
  // ── existing 7 (demos lifted from the repo's own .card.html) ──
  C('Button', 'forms', { viewport: '700x220', card: 'components/forms/button.card.html' }),
  C('Input', 'forms', { viewport: '700x220', card: 'components/forms/input.card.html', rootStyle: `${DEFAULT_ROOT};max-width:640px` }),
  C('Card', 'layout', { viewport: '700x260', card: 'components/layout/card.card.html' }),
  C('Badge', 'feedback', { viewport: '700x160', card: 'components/feedback/badge.card.html' }),
  C('ToastProvider', 'feedback', { file: 'Toast', viewport: '520x260', exports: ['ToastProvider', 'useToast'], rootStyle: `${DEFAULT_ROOT};min-height:200px;position:relative` }),
  C('Table', 'data', { viewport: '700x220', card: 'components/data/table.card.html' }),
  // ── 차트 (self-contained SVG/div, --chart-* 팔레트) ──
  C('BarChart', 'charts', { viewport: '480x260', rootStyle: `${DEFAULT_ROOT};max-width:460px` }),
  C('LineChart', 'charts', { viewport: '480x240', rootStyle: `${DEFAULT_ROOT};max-width:460px` }),
  C('DonutChart', 'charts', { viewport: '480x220', rootStyle: `${DEFAULT_ROOT};max-width:460px` }),
  C('Pagination', 'navigation', { viewport: '520x110', card: 'components/navigation/pagination.card.html' }),
  // ── 폼 입력 확장 ──
  C('Textarea', 'forms', { viewport: '640x220', rootStyle: `${DEFAULT_ROOT};max-width:600px` }),
  C('Select', 'forms', { viewport: '600x180', rootStyle: `${DEFAULT_ROOT};max-width:600px` }),
  C('Checkbox', 'forms', { viewport: '520x160' }),
  C('RadioGroup', 'forms', { viewport: '520x200' }),
  C('Switch', 'forms', { viewport: '520x160' }),
  C('PostEditor', 'forms', { viewport: '640x600', rootStyle: `${DEFAULT_ROOT};max-width:620px;background:var(--gray-50)` }),
  C('CommentForm', 'forms', { viewport: '640x280', rootStyle: `${DEFAULT_ROOT};max-width:600px` }),
  C('ReplyForm', 'forms', { viewport: '600x220', rootStyle: `${DEFAULT_ROOT};max-width:560px` }),
  C('Editor', 'forms', { viewport: '640x800', rootStyle: `${DEFAULT_ROOT};max-width:620px` }),
  // ── 오버레이 & 상태 ──
  C('Alert', 'feedback', { viewport: '600x280', rootStyle: `${DEFAULT_ROOT};max-width:600px` }),
  C('Skeleton', 'feedback', { viewport: '560x200', rootStyle: `${DEFAULT_ROOT};max-width:560px` }),
  C('Spinner', 'feedback', { viewport: '460x120' }),
  C('EmptyState', 'feedback', { viewport: '520x240' }),
  C('Modal', 'overlay', { viewport: '700x460', rootStyle: 'background:#fff' }),
  // ── 커뮤니티 & 탐색 ──
  C('Avatar', 'display', { viewport: '560x120' }),
  C('Tag', 'display', { viewport: '560x120' }),
  C('Tabs', 'navigation', { viewport: '600x150', rootStyle: `${DEFAULT_ROOT};max-width:600px` }),
  C('Breadcrumb', 'navigation', { viewport: '620x130' }),
  C('Sidebar', 'navigation', { viewport: '300x360', rootStyle: `${DEFAULT_ROOT};max-width:280px;background:var(--gray-50)` }),
  // ── 미니멀 유틸 ──
  C('Divider', 'layout', { viewport: '480x240', rootStyle: `${DEFAULT_ROOT};max-width:440px` }),
  C('Link', 'navigation', { viewport: '520x150' }),
  // ── 레이아웃 (전체 화면 구성) ──
  C('Container', 'layout', { viewport: '720x220' }),
  C('Header', 'layout', { viewport: '820x120', rootStyle: 'background:var(--gray-50)' }),
  C('PageHeader', 'layout', { viewport: '700x150', rootStyle: `${DEFAULT_ROOT};max-width:640px` }),
  // ── 레이아웃 구조 (structural building blocks) ──
  C('Grid', 'layout', { viewport: '640x220', rootStyle: `${DEFAULT_ROOT};background:var(--gray-50)` }),
  C('Stack', 'layout', { viewport: '560x200' }),
  C('Section', 'layout', { viewport: '620x220', rootStyle: `${DEFAULT_ROOT};max-width:600px` }),
  C('Split', 'layout', { viewport: '660x180', rootStyle: `${DEFAULT_ROOT};background:var(--gray-50)` }),
  C('SidebarLayout', 'layout', { viewport: '760x300', rootStyle: `${DEFAULT_ROOT};background:var(--gray-50)` }),
  C('Footer', 'layout', { viewport: '760x160' }),
  C('AppShell', 'layout', { viewport: '900x620', rootStyle: 'background:var(--gray-50)' }),
];

// Demos for components with no repo .card.html — render the REAL exported
// component with realistic Korean content.
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
function Demo() { return <ToastProvider><Fire/></ToastProvider>; }
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Textarea: `
const { Textarea } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Textarea label="댓글" placeholder="댓글을 입력하세요" rows={3} />
      <Textarea label="한 줄 소개" rows={2} value="비밀번호가 일치하지 않습니다" onChange={()=>{}} error="20자 이내로 입력하세요" />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Select: `
const { Select } = window.SmalltalkDS;
function Demo(){
  const [v,setV]=React.useState("");
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Select label="게시판" placeholder="게시판 선택" value={v} onChange={e=>setV(e.target.value)}
        options={[{value:"free",label:"자유게시판"},{value:"qna",label:"질문게시판"},{value:"info",label:"정보게시판"}]} />
      <Select label="정렬" value="new" onChange={()=>{}}
        options={[{value:"new",label:"최신순"},{value:"hot",label:"인기순"},{value:"comment",label:"댓글순"}]} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Checkbox: `
const { Checkbox } = window.SmalltalkDS;
function Demo(){
  const [a,setA]=React.useState(true), [b,setB]=React.useState(false);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Checkbox checked={a} onChange={()=>setA(!a)} label="이용약관에 동의합니다 (필수)" />
      <Checkbox checked={b} onChange={()=>setB(!b)} label="마케팅 정보 수신 (선택)" />
      <Checkbox checked disabled label="본인 인증 완료" />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  RadioGroup: `
const { RadioGroup } = window.SmalltalkDS;
function Demo(){
  const [v,setV]=React.useState("page");
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20,fontFamily:"var(--font-sans)"}}>
      <div>
        <div style={{fontSize:12,color:"var(--gray-500)",marginBottom:8}}>목록 방식</div>
        <RadioGroup value={v} onChange={setV} options={[{value:"page",label:"페이지네이션"},{value:"scroll",label:"무한 스크롤"}]} />
      </div>
      <div>
        <div style={{fontSize:12,color:"var(--gray-500)",marginBottom:8}}>공개 범위</div>
        <RadioGroup direction="horizontal" value="all" onChange={()=>{}} options={[{value:"all",label:"전체"},{value:"member",label:"회원"},{value:"me",label:"비공개"}]} />
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Switch: `
const { Switch } = window.SmalltalkDS;
function Demo(){
  const [a,setA]=React.useState(true), [b,setB]=React.useState(false);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Switch checked={a} onChange={setA} label="댓글 알림 받기" />
      <Switch checked={b} onChange={setB} label="야간 방해 금지" />
      <Switch checked disabled label="필수 보안 알림 (해제 불가)" />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  PostEditor: `
const { PostEditor } = window.SmalltalkDS;
function Demo(){
  return (
    <PostEditor
      categories={[{value:"free",label:"자유게시판"},{value:"qna",label:"질문게시판"},{value:"info",label:"정보게시판"}]}
      defaultCategory="free"
      defaultTitle="오늘 장 마감 후기 공유합니다"
      defaultBody={"오늘 코스피 강하게 마감했네요.\\n보유 종목 대부분 플러스 전환했습니다. 다들 어떠셨나요?"}
      defaultTags={["주식","일상"]}
    />
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  CommentForm: `
const { CommentForm } = window.SmalltalkDS;
function Demo(){ return <CommentForm />; }
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  ReplyForm: `
const { ReplyForm } = window.SmalltalkDS;
function Demo(){ return <ReplyForm replyingTo="스몰토커" />; }
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Editor: `
const { Editor } = window.SmalltalkDS;
function V(p){ return <div><div style={{fontSize:12,fontWeight:600,color:"var(--gray-500)",marginBottom:8,textTransform:"uppercase",letterSpacing:".03em",fontFamily:"var(--font-sans)"}}>{p.label}</div>{p.children}</div>; }
function Demo(){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <V label="기본 (Textarea)"><Editor variant="basic" placeholder="내용을 입력하세요" /></V>
      <V label="TipTap (리치 텍스트)"><Editor variant="tiptap" /></V>
      <V label="Novel (Notion 스타일)"><Editor variant="novel" /></V>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Alert: `
const { Alert } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Alert tone="info" title="안내">비밀번호는 4~20자, 2종류 이상 문자를 혼합하세요.</Alert>
      <Alert tone="success" title="저장 완료">프로필이 저장되었습니다.</Alert>
      <Alert tone="warning">로그인 세션이 곧 만료됩니다.</Alert>
      <Alert tone="error" title="오류" onClose={()=>{}}>비밀번호가 일치하지 않습니다.</Alert>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Skeleton: `
const { Skeleton } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Skeleton count={3} />
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <Skeleton width={40} height={40} radius="var(--radius-full)" />
        <div style={{flex:1}}><Skeleton count={2} /></div>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Spinner: `
const { Spinner } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{display:"flex",alignItems:"center",gap:24,fontFamily:"var(--font-sans)"}}>
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={32} />
      <span style={{display:"inline-flex",alignItems:"center",gap:8,color:"var(--gray-500)",fontSize:14}}>
        <Spinner size={16} /> 불러오는 중...
      </span>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  EmptyState: `
const { EmptyState, Button } = window.SmalltalkDS;
function Demo(){
  return (
    <EmptyState title="게시글이 없습니다" description="첫 글을 작성해 보세요."
      action={<Button variant="primary" size="sm">글쓰기</Button>} />
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Modal: `
const { Modal, Button } = window.SmalltalkDS;
function Demo(){
  return (
    <Modal open title="게시글 삭제" onClose={()=>{}}
      footer={<React.Fragment><Button variant="secondary" size="sm">취소</Button><Button variant="danger" size="sm">삭제</Button></React.Fragment>}>
      이 게시글을 정말 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.
    </Modal>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Avatar: `
const { Avatar } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,fontFamily:"var(--font-sans)"}}>
      <Avatar name="스몰토커" size={48} />
      <Avatar name="김재구" size={40} />
      <Avatar name="이영희" size={40} />
      <Avatar name="박민수" size={40} />
      <span style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:14,color:"var(--gray-700)"}}>
        <Avatar name="스몰토커" size={28} /> 스몰토커
      </span>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Tag: `
const { Tag } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
      <Tag tone="blue">#일상</Tag>
      <Tag tone="blue">#질문</Tag>
      <Tag tone="blue">#주식</Tag>
      <Tag tone="gray">공지</Tag>
      <Tag onRemove={()=>{}}>필터: 최신순</Tag>
      <Tag onRemove={()=>{}}>ISA 계좌</Tag>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Tabs: `
const { Tabs } = window.SmalltalkDS;
function Demo(){
  const [t,setT]=React.useState("isa");
  return (
    <div>
      <Tabs value={t} onChange={setT} tabs={[{key:"all",label:"전체"},{key:"isa",label:"ISA"},{key:"pension",label:"연금저축"},{key:"irp",label:"IRP"}]} />
      <div style={{padding:"16px 4px",fontFamily:"var(--font-sans)",fontSize:14,color:"var(--gray-600)"}}>선택된 탭: {t}</div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Breadcrumb: `
const { Breadcrumb } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Breadcrumb items={[{label:"홈",href:"#"},{label:"자유게시판",href:"#"},{label:"오늘 장 마감 후기"}]} />
      <Breadcrumb items={[{label:"포트폴리오",href:"#"},{label:"미래에셋 ISA"}]} />
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Sidebar: `
const { Sidebar } = window.SmalltalkDS;
function Demo(){
  return (
    <Sidebar header="게시판" items={[
      {label:"자유게시판",active:true,count:128},
      {label:"질문게시판",count:42},
      {label:"정보게시판",count:17},
      {label:"공지사항",count:5},
      {section:true,label:"내 활동"},
      {label:"내 글",count:8},
      {label:"스크랩",count:23},
      {label:"알림",count:3},
    ]} />
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Divider: `
const { Divider } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{fontFamily:"var(--font-sans)",fontSize:14,color:"var(--gray-700)"}}>
      <div>게시글 본문 영역</div>
      <Divider />
      <div>댓글 12개</div>
      <Divider label="이전 댓글 더보기" />
      <div style={{display:"flex",alignItems:"center"}}>
        <span>좋아요 24</span><Divider orientation="vertical" />
        <span>조회 1.2k</span><Divider orientation="vertical" />
        <span>스크랩 3</span>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Link: `
const { Link } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12,fontFamily:"var(--font-sans)",fontSize:14,color:"var(--gray-700)"}}>
      <div>자세한 내용은 <Link href="#">게시판 이용 안내</Link>를 참고하세요.</div>
      <Link href="#" external>외부 뉴스 기사 보기</Link>
      <Link href="#" muted>이 글 신고하기</Link>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Container: `
const { Container } = window.SmalltalkDS;
function Box(p){return <div style={{border:"1px dashed var(--gray-300)",borderRadius:"var(--radius-lg)",padding:16,textAlign:"center",fontSize:13,color:"var(--gray-500)",fontFamily:"var(--font-sans)"}}>{p.label}</div>;}
function Demo(){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12,background:"var(--gray-50)",padding:12,borderRadius:"var(--radius-lg)"}}>
      <Container size="content" padding={0}><Box label="content · 최대 768px (본문 열)" /></Container>
      <Container size="form" padding={0}><Box label="form · 최대 384px (인증 폼)" /></Container>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Header: `
const { Header, Button, Avatar } = window.SmalltalkDS;
function Demo(){
  return (
    <Header brand="Smalltalk Community"
      links={[{label:"게시판",href:"#",active:true},{label:"포트폴리오",href:"#"}]}
      right={<React.Fragment><Button variant="ghost" size="sm">로그인</Button><Avatar name="스몰토커" size={28} /></React.Fragment>} />
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  PageHeader: `
const { PageHeader, Button } = window.SmalltalkDS;
function Demo(){
  return (
    <PageHeader title="자유게시판" subtitle="자유롭게 이야기를 나누는 공간"
      actions={<Button variant="primary" size="sm">글쓰기</Button>} />
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Grid: `
const { Grid } = window.SmalltalkDS;
function Cell(p){return <div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-lg)",padding:16,background:"var(--white)",fontSize:13,color:"var(--gray-600)",fontFamily:"var(--font-sans)",textAlign:"center"}}>{p.children}</div>;}
function Demo(){
  return (
    <Grid minItemWidth={150} gap={12}>
      <Cell>항목 1</Cell><Cell>항목 2</Cell><Cell>항목 3</Cell><Cell>항목 4</Cell><Cell>항목 5</Cell><Cell>항목 6</Cell>
    </Grid>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Stack: `
const { Stack, Badge } = window.SmalltalkDS;
function Demo(){
  return (
    <Stack gap={16}>
      <Stack direction="horizontal" gap={8} align="center"><Badge tone="blue">가로 Stack</Badge><Badge tone="green">간격 8</Badge><Badge tone="purple">정렬 center</Badge></Stack>
      <Stack gap={8}>
        <div style={{padding:"8px 12px",background:"var(--gray-50)",borderRadius:"var(--radius-lg)",fontSize:14,fontFamily:"var(--font-sans)",color:"var(--gray-700)"}}>세로 스택 항목 1</div>
        <div style={{padding:"8px 12px",background:"var(--gray-50)",borderRadius:"var(--radius-lg)",fontSize:14,fontFamily:"var(--font-sans)",color:"var(--gray-700)"}}>세로 스택 항목 2</div>
      </Stack>
    </Stack>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Section: `
const { Section, Button } = window.SmalltalkDS;
function Demo(){
  return (
    <Section title="보유 종목" description="미래에셋 ISA 계좌" actions={<Button variant="secondary" size="sm">전체보기</Button>}>
      <div style={{border:"1px dashed var(--gray-300)",borderRadius:"var(--radius-lg)",padding:24,textAlign:"center",fontSize:13,color:"var(--gray-400)",fontFamily:"var(--font-sans)"}}>섹션 콘텐츠 영역</div>
    </Section>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Split: `
const { Split } = window.SmalltalkDS;
function Pane(p){return <div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-lg)",padding:16,background:"var(--white)",fontSize:13,color:"var(--gray-600)",fontFamily:"var(--font-sans)"}}>{p.children}</div>;}
function Demo(){
  return <Split ratio="2fr 1fr" left={<Pane>주 콘텐츠 영역 (2fr)</Pane>} right={<Pane>사이드 위젯 (1fr)</Pane>} />;
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  SidebarLayout: `
const { SidebarLayout } = window.SmalltalkDS;
function Demo(){
  return (
    <SidebarLayout title="게시판" nav={[{label:"자유게시판",active:true,count:128},{label:"질문게시판",count:42},{label:"정보게시판",count:17},{label:"공지사항",count:5}]}>
      <div style={{border:"1px dashed var(--gray-300)",borderRadius:"var(--radius-lg)",padding:"36px 24px",textAlign:"center",fontSize:13,color:"var(--gray-400)",fontFamily:"var(--font-sans)"}}>메인 콘텐츠 영역</div>
    </SidebarLayout>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  Footer: `
const { Footer } = window.SmalltalkDS;
function Demo(){
  return <Footer brand="Smalltalk Community" links={[{label:"이용약관",href:"#"},{label:"개인정보처리방침",href:"#"},{label:"문의",href:"#"}]} note="© 2026 Smalltalk Community. 커뮤니티 게시판 · 포트폴리오 트래커." />;
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  AppShell: `
const { AppShell, Header, SidebarLayout, PageHeader, Footer, Button, Badge } = window.SmalltalkDS;
function Row(p){ return <div style={{padding:"12px 4px",borderBottom:"1px solid var(--gray-200)",fontSize:14,color:"var(--gray-900)"}}>{p.children}</div>; }
function Demo(){
  const [tab,setTab]=React.useState("free");
  return (
    <AppShell
      header={<Header brand="Smalltalk Community" links={[{label:"게시판",href:"#",active:true},{label:"포트폴리오",href:"#"}]} right={<Button variant="ghost" size="sm">로그인</Button>} />}
      footer={<Footer links={[{label:"이용약관",href:"#"},{label:"개인정보처리방침",href:"#"}]} note="© 2026 Smalltalk Community." />}
    >
      <SidebarLayout title="게시판" nav={[{label:"자유게시판",active:true,count:128},{label:"질문게시판",count:42},{label:"정보게시판",count:17}]}>
        <PageHeader title="자유게시판" subtitle="자유롭게 이야기를 나누는 공간" actions={<Button variant="primary" size="sm">글쓰기</Button>} />
        <Row><Badge tone="blue">인기</Badge> 오늘 장 마감 후기 공유합니다</Row>
        <Row>초보 질문 있습니다</Row>
        <Row>주말에 다들 뭐 하세요?</Row>
      </SidebarLayout>
    </AppShell>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  BarChart: `
const { BarChart } = window.SmalltalkDS;
function Demo(){
  return <BarChart showValues data={[
    {label:"월",value:62},{label:"화",value:74},{label:"수",value:58},{label:"목",value:81},{label:"금",value:69},{label:"토",value:44},{label:"일",value:86},
  ]} />;
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  LineChart: `
const { LineChart } = window.SmalltalkDS;
function Demo(){
  return <LineChart data={[
    {label:"2월",value:172},{label:"3월",value:181},{label:"4월",value:168},{label:"5월",value:195},{label:"6월",value:203},{label:"7월",value:214},
  ]} />;
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,

  DonutChart: `
const { DonutChart } = window.SmalltalkDS;
function Demo(){
  return <DonutChart data={[
    {label:"국내주식",value:52},{label:"해외주식",value:28},{label:"채권",value:12},{label:"현금",value:8},
  ]} />;
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
};

// ── 예제 조합: small compositions from multiple components ──
const EXAMPLES = [
  {
    file: 'comment-form', title: '댓글 작성 폼', uses: 'Avatar · Textarea · Checkbox · Button',
    demo: `
const { Avatar, Textarea, Checkbox, Button } = window.SmalltalkDS;
function Demo(){
  const [secret,setSecret]=React.useState(false);
  return (
    <div style={{maxWidth:600,fontFamily:"var(--font-sans)"}}>
      <div style={{display:"flex",gap:12}}>
        <Avatar name="스몰토커" size={40} />
        <div style={{flex:1}}>
          <Textarea placeholder="댓글을 입력하세요" rows={3} />
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
            <Checkbox checked={secret} onChange={()=>setSecret(!secret)} label="비밀 댓글" />
            <Button variant="primary" size="sm">댓글 등록</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
  {
    file: 'account-card', title: '포트폴리오 계좌 카드', uses: 'Card · Badge · Tabs · Divider · Table',
    demo: `
const { Card, Badge, Tabs, Divider, Table } = window.SmalltalkDS;
function Demo(){
  const [t,setT]=React.useState("hold");
  const rows=[
    {id:1,name:"삼성전자",qty:120,value:"1,845만원",ret:"+12.40%",pos:true},
    {id:2,name:"카카오",qty:40,value:"312만원",ret:"-4.10%",pos:false},
    {id:3,name:"NAVER",qty:15,value:"278만원",ret:"+3.20%",pos:true},
  ];
  return (
    <div style={{maxWidth:640,fontFamily:"var(--font-sans)"}}>
      <Card elevated>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:15,fontWeight:600}}>미래에셋 ISA</span>
            <Badge tone="green">ISA</Badge>
          </div>
          <span style={{fontFamily:"var(--font-mono)",fontSize:18,fontWeight:700}}>2,435만원</span>
        </div>
        <Divider spacing={14} />
        <Tabs value={t} onChange={setT} tabs={[{key:"hold",label:"보유 종목"},{key:"hist",label:"거래 내역"}]} />
        <div style={{marginTop:14}}>
          <Table rowKey="id" rows={rows} columns={[
            {key:"name",label:"종목"},
            {key:"qty",label:"수량",align:"right",mono:true},
            {key:"value",label:"평가금액",align:"right",mono:true},
            {key:"ret",label:"수익률",align:"right",mono:true,render:(r)=><span style={{color:r.pos?"var(--red-500)":"var(--blue-500)",fontWeight:600}}>{r.ret}</span>},
          ]} />
        </div>
      </Card>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
  {
    file: 'board-header', title: '게시판 목록 헤더', uses: 'Breadcrumb · Tabs · Tag · Select · Button · Pagination',
    demo: `
const { Breadcrumb, Tabs, Tag, Select, Button, Pagination } = window.SmalltalkDS;
function Demo(){
  const [tab,setTab]=React.useState("free");
  const [page,setPage]=React.useState(1);
  return (
    <div style={{maxWidth:680,fontFamily:"var(--font-sans)"}}>
      <Breadcrumb items={[{label:"홈",href:"#"},{label:"커뮤니티",href:"#"},{label:"자유게시판"}]} />
      <div style={{marginTop:12}}>
        <Tabs value={tab} onChange={setTab} tabs={[{key:"free",label:"자유"},{key:"qna",label:"질문"},{key:"info",label:"정보"}]} />
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14,gap:12,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <Tag tone="blue">#인기</Tag><Tag tone="blue">#오늘의글</Tag>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{width:130}}><Select value="new" onChange={()=>{}} options={[{value:"new",label:"최신순"},{value:"hot",label:"인기순"}]} /></div>
          <Button variant="primary" size="sm">글쓰기</Button>
        </div>
      </div>
      <div style={{marginTop:22}}><Pagination page={page} totalPages={5} onChange={setPage} /></div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
  {
    file: 'login-form', title: '로그인 폼', uses: 'Card · Input · Checkbox · Button · Divider · Link',
    demo: `
const { Card, Input, Checkbox, Button, Divider, Link } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{maxWidth:384,margin:"0 auto",fontFamily:"var(--font-sans)"}}>
      <h1 style={{fontSize:24,fontWeight:700,textAlign:"center",margin:"0 0 20px",color:"var(--gray-900)"}}>로그인</h1>
      <Card padding={24}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Input label="아이디" placeholder="영문 소문자 시작, 4~15자" />
          <Input label="비밀번호" type="password" placeholder="비밀번호" />
          <Checkbox label="로그인 상태 유지" />
          <Button variant="primary" size="lg">로그인</Button>
          <Divider label="또는" spacing={4} />
          <div style={{textAlign:"center",fontSize:14,color:"var(--gray-500)"}}>아직 회원이 아니신가요? <Link href="#">회원가입</Link></div>
        </div>
      </Card>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
  {
    file: 'profile-card', title: '프로필 카드', uses: 'Avatar · Badge · Divider · Button',
    demo: `
const { Avatar, Badge, Button, Divider } = window.SmalltalkDS;
function Stat(p){ return <div style={{textAlign:"center"}}><div style={{fontFamily:"var(--font-mono)",fontWeight:700,fontSize:18,color:"var(--gray-900)"}}>{p.v}</div><div style={{fontSize:12,color:"var(--gray-400)"}}>{p.k}</div></div>; }
function Demo(){
  return (
    <div style={{maxWidth:360,border:"1px solid var(--gray-200)",borderRadius:"var(--radius-xl)",background:"var(--white)",padding:20,fontFamily:"var(--font-sans)"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <Avatar name="스몰토커" size={52} />
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:16,fontWeight:600}}>스몰토커</span>
            <Badge tone="blue">활성</Badge>
          </div>
          <div style={{fontSize:13,color:"var(--gray-500)",marginTop:2}}>가입 2024.03</div>
        </div>
      </div>
      <Divider spacing={14} />
      <div style={{display:"flex",justifyContent:"space-around"}}>
        <Stat v="128" k="게시글" /><Stat v="342" k="댓글" /><Stat v="1.2k" k="좋아요" />
      </div>
      <div style={{marginTop:16}}><Button variant="primary" size="lg">팔로우</Button></div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
  {
    file: 'search-bar', title: '검색 바', uses: 'Input · Button · Tag',
    demo: `
const { Input, Button, Tag } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{maxWidth:600,fontFamily:"var(--font-sans)"}}>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1}}><Input placeholder="검색어를 입력하세요" /></div>
        <Button variant="primary">검색</Button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10,alignItems:"center"}}>
        <span style={{fontSize:13,color:"var(--gray-500)"}}>최근 검색:</span>
        <Tag onRemove={()=>{}}>삼성전자</Tag><Tag onRemove={()=>{}}>ISA 계좌</Tag><Tag onRemove={()=>{}}>배당주</Tag>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
];

// ── 화면: full-screen templates composed from the DS components ──
const SCREENS = [
  {
    file: 'board-list', title: '게시판 목록 (board-list)', uses: 'AppShell · Header · SidebarLayout · Split · Section · Stack · PageHeader · Tabs · Badge · Tag · Avatar · Pagination · Footer',
    demo: `
const { AppShell, Header, SidebarLayout, Split, Section, Stack, PageHeader, Tabs, Badge, Tag, Avatar, Button, Pagination, Footer } = window.SmalltalkDS;
function Row(p){
  return (
    <div style={{padding:"12px 4px",borderBottom:"1px solid var(--gray-200)"}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        {p.hot && <Badge tone="blue">인기</Badge>}
        <span style={{fontSize:15,fontWeight:600,color:"var(--gray-900)"}}>{p.title}</span>
        <span style={{fontSize:13,color:"var(--gray-400)"}}>[{p.cnt}]</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
        <Avatar name={p.author} size={20} />
        <span style={{fontSize:13,color:"var(--gray-500)"}}>{p.author}</span>
        <Tag tone="blue">{p.tag}</Tag>
        <span style={{marginLeft:"auto",fontFamily:"var(--font-mono)",fontSize:12,color:"var(--gray-400)"}}>2026-07-11</span>
      </div>
    </div>
  );
}
function Item(p){ return <li style={{fontSize:13,color:"var(--gray-600)",padding:"6px 0",borderBottom:"1px solid var(--gray-100)",listStyle:"none"}}>{p.children}</li>; }
function Panel(p){ return <div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-xl)",background:"var(--white)",padding:16}}>{p.children}</div>; }
function Demo(){
  const [tab,setTab]=React.useState("free");
  const [page,setPage]=React.useState(2);
  const posts=(
    <div>
      <PageHeader title="자유게시판" subtitle="자유롭게 이야기를 나누는 공간" actions={<Button variant="primary" size="sm">글쓰기</Button>} />
      <Tabs value={tab} onChange={setTab} tabs={[{key:"free",label:"자유"},{key:"qna",label:"질문"},{key:"info",label:"정보"}]} />
      <div style={{marginTop:8}}>
        <Row title="오늘 장 마감 후기 공유합니다" author="스몰토커" tag="#주식" cnt={12} hot />
        <Row title="초보 질문 있습니다" author="김재구" tag="#질문" cnt={4} />
        <Row title="주말에 다들 뭐 하세요?" author="이영희" tag="#일상" cnt={8} />
        <Row title="ISA 계좌 추천 부탁드려요" author="박민수" tag="#질문" cnt={23} hot />
        <Row title="배당주 포트폴리오 공유합니다" author="정하나" tag="#주식" cnt={7} />
      </div>
      <div style={{marginTop:20}}><Pagination page={page} totalPages={5} onChange={setPage} /></div>
    </div>
  );
  const widgets=(
    <Stack gap={16}>
      <Panel><Section title="인기 글"><ul style={{margin:0,padding:0}}><Item>ISA 계좌 추천 부탁드려요</Item><Item>오늘 장 마감 후기</Item><Item>배당주 포트폴리오 공유</Item></ul></Section></Panel>
      <Panel><Section title="인기 태그"><div style={{display:"flex",flexWrap:"wrap",gap:6}}><Tag tone="blue">#주식</Tag><Tag tone="blue">#질문</Tag><Tag tone="blue">#일상</Tag><Tag tone="blue">#ISA</Tag><Tag tone="gray">#공지</Tag></div></Section></Panel>
    </Stack>
  );
  return (
    <AppShell
      header={<Header brand="Smalltalk Community" links={[{label:"게시판",href:"#",active:true},{label:"포트폴리오",href:"#"}]} right={<Button variant="ghost" size="sm">로그인</Button>} />}
      footer={<Footer links={[{label:"이용약관",href:"#"},{label:"개인정보처리방침",href:"#"},{label:"문의",href:"#"}]} note="© 2026 Smalltalk Community." />}
    >
      <SidebarLayout title="게시판" nav={[{label:"자유게시판",active:true,count:128},{label:"질문게시판",count:42},{label:"정보게시판",count:17},{label:"공지사항",count:5}]}>
        <Split ratio="1fr 280px" left={posts} right={widgets} />
      </SidebarLayout>
    </AppShell>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
  {
    file: 'dashboard', title: '포트폴리오 대시보드', uses: 'Header · SidebarLayout · Grid · Section · Stack · Badge · Table · LineChart · DonutChart · Footer',
    demo: `
const { Header, SidebarLayout, Grid, Section, Stack, Badge, Table, Button, Footer, LineChart, DonutChart } = window.SmalltalkDS;
function Stat(p){
  return (
    <div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-xl)",background:"var(--white)",padding:16}}>
      <div style={{fontSize:12,color:"var(--gray-500)"}}>{p.label}</div>
      <div style={{fontSize:22,fontWeight:700,fontFamily:"var(--font-mono)",marginTop:6,color:"var(--gray-900)"}}>{p.value}</div>
      {p.delta && <div style={{fontSize:12,marginTop:4,fontWeight:600,color:p.pos?"var(--red-500)":"var(--gray-400)"}}>{p.delta}</div>}
    </div>
  );
}
function Demo(){
  const rows=[
    {id:1,name:"삼성전자",qty:120,value:"1,845만원",ret:"+12.40%",pos:true},
    {id:2,name:"카카오",qty:40,value:"312만원",ret:"-4.10%",pos:false},
    {id:3,name:"NAVER",qty:15,value:"278만원",ret:"+3.20%",pos:true},
    {id:4,name:"현대차",qty:22,value:"456만원",ret:"+1.10%",pos:true},
  ];
  return (
    <div style={{background:"var(--gray-50)",minHeight:"100vh"}}>
      <Header brand="Smalltalk Community" links={[{label:"게시판",href:"#"},{label:"포트폴리오",href:"#",active:true}]}
        right={<Button variant="ghost" size="sm">로그아웃</Button>} />
      <div style={{maxWidth:1120,margin:"0 auto",padding:"20px 16px"}}>
        <SidebarLayout title="계좌" nav={[{label:"전체",active:true},{label:"미래에셋 ISA",count:14},{label:"한투 연금저축",count:6},{label:"IRP",count:3}]}>
          <Stack gap={20}>
            <Grid minItemWidth={170} gap={12}>
              <Stat label="총 자산" value="2.14억원" delta="+12.3%" pos />
              <Stat label="평가손익" value="+2,340만원" delta="오늘 +0.8%" pos />
              <Stat label="투자원금" value="1.91억원" />
              <Stat label="보유 종목" value="14개" />
            </Grid>
            <div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-xl)",background:"var(--white)",padding:16}}>
              <Section title="자산 추이" description="최근 6개월">
                <LineChart height={150} data={[{label:"2월",value:172},{label:"3월",value:181},{label:"4월",value:168},{label:"5월",value:195},{label:"6월",value:203},{label:"7월",value:214}]} />
              </Section>
            </div>
            <div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-xl)",background:"var(--white)",padding:16}}>
              <Section title="자산 구성">
                <DonutChart data={[{label:"국내주식",value:52},{label:"해외주식",value:28},{label:"채권",value:12},{label:"현금",value:8}]} />
              </Section>
            </div>
            <div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-xl)",background:"var(--white)",padding:16}}>
              <Section title="보유 종목" actions={<Button variant="secondary" size="sm">전체보기</Button>}>
                <Table rowKey="id" rows={rows} columns={[
                  {key:"name",label:"종목"},
                  {key:"qty",label:"수량",align:"right",mono:true},
                  {key:"value",label:"평가금액",align:"right",mono:true},
                  {key:"ret",label:"수익률",align:"right",mono:true,render:(r)=><span style={{color:r.pos?"var(--red-500)":"var(--blue-500)",fontWeight:600}}>{r.ret}</span>},
                ]} />
              </Section>
            </div>
          </Stack>
        </SidebarLayout>
        <Footer links={[{label:"이용약관",href:"#"},{label:"고객센터",href:"#"}]} note="© 2026 Smalltalk Community. 투자 정보는 참고용입니다." />
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
  {
    file: 'analytics', title: '운영 통계 대시보드', uses: 'Header · SidebarLayout · Grid · Split · Section · Stack · Badge · BarChart · Table · Footer',
    demo: `
const { Header, SidebarLayout, Grid, Split, Section, Stack, Badge, Table, Button, Footer, BarChart } = window.SmalltalkDS;
function Kpi(p){
  return (
    <div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-xl)",background:"var(--white)",padding:16}}>
      <div style={{fontSize:12,color:"var(--gray-500)"}}>{p.label}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:8,marginTop:6}}>
        <span style={{fontSize:22,fontWeight:700,fontFamily:"var(--font-mono)",color:"var(--gray-900)"}}>{p.value}</span>
        {p.delta && <Badge tone={p.down?"gray":"green"}>{p.delta}</Badge>}
      </div>
    </div>
  );
}
function BoardRow(p){ return <div style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"8px 0",borderBottom:"1px solid var(--gray-100)"}}><span style={{color:"var(--gray-700)"}}>{p.name}</span><span style={{fontFamily:"var(--font-mono)",color:"var(--gray-400)"}}>{p.n}</span></div>; }
function Demo(){
  const reports=[
    {id:1,type:"게시글",target:"스팸 광고 의심 글",who:"김재구",st:"대기"},
    {id:2,type:"댓글",target:"욕설 신고",who:"이영희",st:"처리완료"},
    {id:3,type:"게시글",target:"중복 게시",who:"박민수",st:"대기"},
  ];
  return (
    <div style={{background:"var(--gray-50)",minHeight:"100vh"}}>
      <Header brand="Smalltalk Admin" links={[{label:"대시보드",href:"#",active:true},{label:"게시글",href:"#"},{label:"회원",href:"#"}]}
        right={<Button variant="ghost" size="sm">관리자</Button>} />
      <div style={{maxWidth:1120,margin:"0 auto",padding:"20px 16px"}}>
        <SidebarLayout title="관리" nav={[{label:"대시보드",active:true},{label:"게시글 관리",count:1240},{label:"회원 관리",count:5820},{label:"신고 처리",count:12}]}>
          <Stack gap={20}>
            <Grid minItemWidth={170} gap={12}>
              <Kpi label="오늘 방문자" value="1,240" delta="+8%" />
              <Kpi label="신규 글" value="86" delta="+12%" />
              <Kpi label="신규 댓글" value="342" delta="+5%" />
              <Kpi label="신규 가입" value="24" delta="-3%" down />
            </Grid>
            <Split ratio="1fr 320px"
              left={<div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-xl)",background:"var(--white)",padding:16}}><Section title="주간 활동" description="일별 신규 글"><BarChart height={150} data={[{label:"월",value:62},{label:"화",value:74},{label:"수",value:58},{label:"목",value:81},{label:"금",value:69},{label:"토",value:44},{label:"일",value:86}]} /></Section></div>}
              right={<div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-xl)",background:"var(--white)",padding:16}}><Section title="인기 게시판"><BoardRow name="자유게시판" n="128" /><BoardRow name="질문게시판" n="42" /><BoardRow name="정보게시판" n="17" /><BoardRow name="공지사항" n="5" /></Section></div>} />
            <div style={{border:"1px solid var(--gray-200)",borderRadius:"var(--radius-xl)",background:"var(--white)",padding:16}}>
              <Section title="최근 신고" actions={<Button variant="secondary" size="sm">전체보기</Button>}>
                <Table rowKey="id" rows={reports} columns={[
                  {key:"type",label:"유형",render:(r)=><Badge tone="gray">{r.type}</Badge>},
                  {key:"target",label:"대상"},
                  {key:"who",label:"신고자"},
                  {key:"st",label:"상태",align:"right",render:(r)=><Badge tone={r.st==="대기"?"orange":"green"}>{r.st}</Badge>},
                ]} />
              </Section>
            </div>
          </Stack>
        </SidebarLayout>
        <Footer brand="Smalltalk Admin" links={[{label:"운영정책",href:"#"}]} note="© 2026 Smalltalk Community 운영팀." />
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
  {
    file: 'login', title: '로그인', uses: 'Header · Container · Card · Input · Checkbox · Button · Divider · Link',
    demo: `
const { Header, Container, Card, Input, Checkbox, Button, Divider, Link } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{background:"var(--gray-50)",minHeight:"100vh"}}>
      <Header brand="Smalltalk Community" links={[{label:"게시판",href:"#"},{label:"포트폴리오",href:"#"}]} />
      <div style={{display:"flex",justifyContent:"center",padding:"48px 16px"}}>
        <Container size="form" padding={0}>
          <h1 style={{fontSize:24,fontWeight:700,textAlign:"center",margin:"0 0 24px",fontFamily:"var(--font-sans)",color:"var(--gray-900)"}}>로그인</h1>
          <Card padding={24}>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <Input label="아이디" placeholder="영문 소문자 시작, 4~15자" />
              <Input label="비밀번호" type="password" placeholder="비밀번호" />
              <Checkbox label="로그인 상태 유지" />
              <Button variant="primary" size="lg">로그인</Button>
              <Divider label="또는" spacing={4} />
              <div style={{textAlign:"center",fontSize:14,color:"var(--gray-500)",fontFamily:"var(--font-sans)"}}>
                아직 회원이 아니신가요? <Link href="#">회원가입</Link>
              </div>
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
  {
    file: 'register', title: '회원가입', uses: 'Header · Container · Card · Input · Checkbox · Button · Link',
    demo: `
const { Header, Container, Card, Input, Checkbox, Button, Link } = window.SmalltalkDS;
function Demo(){
  return (
    <div style={{background:"var(--gray-50)",minHeight:"100vh"}}>
      <Header brand="Smalltalk Community" links={[{label:"게시판",href:"#"},{label:"포트폴리오",href:"#"}]} />
      <div style={{display:"flex",justifyContent:"center",padding:"40px 16px"}}>
        <Container size="form" padding={0}>
          <h1 style={{fontSize:24,fontWeight:700,textAlign:"center",margin:"0 0 24px",fontFamily:"var(--font-sans)",color:"var(--gray-900)"}}>회원가입</h1>
          <Card padding={24}>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <Input label="아이디" placeholder="영문 소문자 시작, 4~15자" />
              <Input label="비밀번호" type="password" placeholder="4~20자, 2종류 이상 혼합" />
              <Input label="비밀번호 확인" type="password" error="비밀번호가 일치하지 않습니다" />
              <Input label="닉네임" placeholder="2~10자" />
              <Checkbox label="이용약관 및 개인정보처리방침에 동의합니다 (필수)" />
              <Button variant="primary" size="lg">가입하기</Button>
              <div style={{textAlign:"center",fontSize:14,color:"var(--gray-500)",fontFamily:"var(--font-sans)"}}>이미 회원이신가요? <Link href="#">로그인</Link></div>
            </div>
          </Card>
        </Container>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(Demo));`,
  },
];

const rd = (p) => readFileSync(join(ROOT, p), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function demoFor(c) {
  if (AUTHORED_DEMOS[c.name]) return AUTHORED_DEMOS[c.name];
  const m = /<script[^>]*id="app-src"[^>]*>([\s\S]*?)<\/script>/.exec(rd(c.card));
  if (!m) throw new Error(`no app-src demo found in ${c.card} for ${c.name}`);
  return m[1].trim();
}

function pageHtml({ dsCard, depth, rootStyle, demoJs }) {
  const up = '../'.repeat(depth);
  return `${dsCard ? dsCard + '\n' : ''}<!doctype html>
<html><head><meta charset="utf-8">
  <link rel="stylesheet" href="${up}styles.css">
  <style>body{margin:0;background:#fff}</style>
</head><body>
  <div id="root" style="${rootStyle}"></div>
  <script src="${up}_vendor/react.js"></script>
  <script src="${up}_vendor/react-dom.js"></script>
  <script src="${up}_ds_bundle.js"></script>
  <script>
${demoJs}
  </script>
</body></html>
`;
}

const transform = async (src) => (await esbuild.transform(src, { loader: 'jsx' })).code;

// ── Component API (for Props table + Playground) ──
// Types come from the <Name>Props interface in the repo .d.ts; defaults from
// the .jsx destructure. Deliberately simple regex parsing — the DS's own
// .d.ts/.jsx are flat and consistent.
function classifyType(type) {
  const t = type.replace(/\s+/g, '');
  if (/^"[^"]*"(\|"[^"]*")*$/.test(t)) return { kind: 'enum', options: [...type.matchAll(/"([^"]*)"/g)].map((x) => x[1]) };
  if (t === 'boolean') return { kind: 'bool' };
  if (t === 'number' || t === 'number|string' || t === 'string|number') return { kind: 'number' };
  if (t === 'string') return { kind: 'string' };
  if (/ReactNode|JSX\.Element/.test(type)) return { kind: 'node' };
  return { kind: 'complex' };
}
const stripQuotes = (s) => (s == null ? s : String(s).trim().replace(/^["'`]|["'`]$/g, ''));
function parseApi(c) {
  const dts = rd(c.dts);
  const src = rd(c.src);
  const body = new RegExp(`export interface ${c.name}Props[^{]*\\{([\\s\\S]*?)\\n\\}`).exec(dts)?.[1] ?? '';
  const dm = new RegExp(`function ${c.name}\\(\\{([\\s\\S]*?)\\}\\)`).exec(src);
  const defaults = {};
  if (dm) {
    for (const part of dm[1].split(/,(?![^[\]{}]*[\]}])/)) {
      const d = /^\s*(\w+)\s*=\s*([\s\S]+?)\s*$/.exec(part);
      if (d) defaults[d[1]] = d[2].trim();
    }
  }
  const props = [];
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('/*') || line.startsWith('*') || line.startsWith('//')) continue;
    const pm = /^(\w+)(\?)?:\s*(.+?);?$/.exec(line);
    if (!pm) continue;
    props.push({ name: pm[1], optional: !!pm[2], type: pm[3].trim(), def: defaults[pm[1]], ...classifyType(pm[3].trim()) });
  }
  return props;
}
// Playground-able: has ≥1 simple controllable prop and no REQUIRED complex prop.
const PG_DENY = new Set(['ToastProvider', 'Modal']);
function playgroundable(c, props) {
  if (PG_DENY.has(c.name)) return false;
  if (!props.some((p) => ['enum', 'bool', 'number', 'string'].includes(p.kind))) return false;
  if (props.some((p) => p.kind === 'complex' && !p.optional)) return false;
  return true;
}
// Initial control values from parsed defaults.
function initialValue(p) {
  if (p.kind === 'enum') return stripQuotes(p.def) || p.options[0];
  if (p.kind === 'bool') return p.def === 'true';
  if (p.kind === 'number') { const n = Number(stripQuotes(p.def)); return Number.isFinite(n) ? n : null; }
  if (p.kind === 'string') return stripQuotes(p.def) ?? '';
  if (p.kind === 'node') return p.name === 'children' ? '예시' : '';
  return null;
}
function apiSchema(c) {
  const props = parseApi(c);
  const controllable = props
    .filter((p) => ['enum', 'bool', 'number', 'string'].includes(p.kind) || (p.kind === 'node' && p.name === 'children'))
    .map((p) => ({ name: p.name, kind: p.kind, options: p.options, value: initialValue(p) }));
  return { props, controllable, playground: playgroundable(c, props) };
}

// Props/API table markup for a gallery card.
function propsTableHtml(props) {
  if (!props.length) return '<p class="pg-empty">props 없음</p>';
  const rows = props.map((p) =>
    `<tr><td><code>${esc(p.name)}</code>${p.optional ? '' : ' <span class="req">*</span>'}</td>` +
    `<td><code class="ty">${esc(p.type)}</code></td><td>${p.def != null ? `<code>${esc(p.def)}</code>` : '—'}</td></tr>`).join('');
  return `<table class="props"><thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead><tbody>${rows}</tbody></table>`;
}
// The demo JSX (minus the ReactDOM render line) for the Code panel.
function codeForDemo(c) {
  return demoFor(c).replace(/\n?ReactDOM\.createRoot[\s\S]*$/, '').trim();
}

// Per-component interactive playground (local gallery only; not uploaded).
function playgroundHtml(c, schema) {
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(c.name)} · Playground</title>
<link rel="stylesheet" href="../styles.css">
<style>
  *{box-sizing:border-box} body{margin:0;font-family:var(--font-sans);color:var(--gray-900);background:var(--gray-50)}
  .pg{display:grid;grid-template-columns:1fr 300px;min-height:100vh}
  .stage{display:flex;align-items:center;justify-content:center;padding:32px;overflow:auto;background:var(--white);background-image:linear-gradient(var(--gray-100) 1px,transparent 1px),linear-gradient(90deg,var(--gray-100) 1px,transparent 1px);background-size:16px 16px}
  .panel{border-left:1px solid var(--gray-200);background:#fff;padding:16px;overflow:auto}
  .panel h3{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--gray-400);margin:0 0 10px}
  .ctl{margin-bottom:12px} .ctl label{display:block;font-size:12px;color:var(--gray-600);margin-bottom:4px}
  .ctl select,.ctl input[type=text],.ctl input[type=number]{width:100%;font-family:var(--font-sans);font-size:13px;padding:6px 8px;border:1px solid var(--gray-200);border-radius:var(--radius-lg);outline:none}
  .ctl select:focus,.ctl input:focus{box-shadow:0 0 0 2px var(--blue-500)}
  .row{display:flex;align-items:center;gap:8px}
  pre.code{background:var(--gray-900);color:#e5e7eb;font-family:var(--font-mono);font-size:12px;line-height:1.6;padding:12px;border-radius:var(--radius-lg);overflow:auto;white-space:pre-wrap;word-break:break-word;margin:0}
  .copy{margin-top:8px;font-family:var(--font-sans);font-size:12px;font-weight:500;padding:6px 12px;border:1px solid var(--gray-200);background:#fff;border-radius:var(--radius-lg);cursor:pointer}
  .copy:hover{border-color:var(--blue-400);color:var(--blue-600)}
  @media(max-width:640px){.pg{grid-template-columns:1fr}.panel{border-left:0;border-top:1px solid var(--gray-200)}}
</style>
</head><body>
<div class="pg">
  <div class="stage"><div id="root"></div></div>
  <div class="panel">
    <h3>Controls</h3><div id="controls"></div>
    <h3 style="margin-top:20px">Code</h3><pre class="code" id="code"></pre>
    <button class="copy" id="copy">코드 복사</button>
  </div>
</div>
<script src="../_vendor/react.js"></script>
<script src="../_vendor/react-dom.js"></script>
<script src="../_ds_bundle.js"></script>
<script>
  var NAME=${JSON.stringify(c.name)};
  var SCHEMA=${JSON.stringify(schema)};
  var state={}; SCHEMA.forEach(function(s){ state[s.name]=s.value; });
  var root=ReactDOM.createRoot(document.getElementById('root'));
  function props(){ var p={}; SCHEMA.forEach(function(s){ if(s.name==='children')return; var v=state[s.name]; if(v===''||v===null||v===undefined)return; p[s.name]=v; }); return p; }
  function childText(){ var s=SCHEMA.filter(function(x){return x.name==='children'})[0]; return s?state.children:null; }
  function render(){
    var C=window.SmalltalkDS[NAME]; var kids=childText();
    try{ root.render(kids!=null&&kids!==''?React.createElement(C,props(),kids):React.createElement(C,props())); }
    catch(e){ root.render(React.createElement('div',{style:{color:'var(--red-500)',fontFamily:'var(--font-sans)',fontSize:13}}, String(e&&e.message||e))); }
    document.getElementById('code').textContent=codeStr();
  }
  function codeStr(){
    var attrs=SCHEMA.filter(function(s){return s.name!=='children'}).map(function(s){
      var v=state[s.name]; if(v===''||v===null||v===undefined)return null;
      if(s.kind==='bool')return v?s.name:null;
      if(s.kind==='number')return s.name+'={'+v+'}';
      return s.name+'="'+String(v)+'"';
    }).filter(Boolean).join(' ');
    var open='<'+NAME+(attrs?' '+attrs:'');
    var kids=childText();
    return (kids!=null&&kids!=='')?open+'>'+kids+'</'+NAME+'>':open+' />';
  }
  var host=document.getElementById('controls');
  SCHEMA.forEach(function(s){
    var wrap=document.createElement('div'); wrap.className='ctl';
    var lab=document.createElement('label'); lab.textContent=s.name;
    var el;
    if(s.kind==='enum'){ el=document.createElement('select'); s.options.forEach(function(o){var op=document.createElement('option');op.value=o;op.textContent=o;el.appendChild(op)}); el.value=state[s.name]; el.onchange=function(){state[s.name]=el.value;render()}; }
    else if(s.kind==='bool'){ el=document.createElement('input'); el.type='checkbox'; el.checked=!!state[s.name]; el.onchange=function(){state[s.name]=el.checked;render()}; lab.className='row'; lab.insertBefore(el,lab.firstChild); wrap.appendChild(lab); host.appendChild(wrap); return; }
    else if(s.kind==='number'){ el=document.createElement('input'); el.type='number'; if(state[s.name]!=null)el.value=state[s.name]; el.oninput=function(){state[s.name]=el.value===''?null:Number(el.value);render()}; }
    else { el=document.createElement('input'); el.type='text'; el.value=state[s.name]||''; el.oninput=function(){state[s.name]=el.value;render()}; }
    wrap.appendChild(lab); wrap.appendChild(el); host.appendChild(wrap);
  });
  document.getElementById('copy').onclick=function(){ navigator.clipboard&&navigator.clipboard.writeText(codeStr()); var b=document.getElementById('copy'); b.textContent='복사됨 ✓'; setTimeout(function(){b.textContent='코드 복사'},1200); };
  render();
</script>
</body></html>
`;
}

async function main() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(join(OUT, '_vendor'), { recursive: true });

  // 1) Synth entry → IIFE at window.<GLOBAL>.
  const entry = join(ROOT, '.ds-sync', '.synth-entry.jsx');
  writeFileSync(entry, COMPONENTS.map((c) =>
    `export { ${c.exports.join(', ')} } from ${JSON.stringify(join(ROOT, c.src))};`).join('\n') + '\n');
  await bundleToIife({ entry, globalName: GLOBAL, nodePaths: NM, out: OUT });

  // 2) Vendor React.
  await vendorReact({ nodeModules: NM, out: OUT });

  // 3) Styling + tokens.
  cpSync(join(ROOT, 'styles.css'), join(OUT, 'styles.css'));
  cpSync(join(ROOT, 'tokens'), join(OUT, 'tokens'), { recursive: true });

  // 4) Guidelines.
  if (existsSync(join(ROOT, 'guidelines'))) {
    cpSync(join(ROOT, 'guidelines'), join(OUT, 'guidelines'), { recursive: true });
  }

  // 5) Per-component dirs.
  const promptHead = {};
  for (const c of COMPONENTS) {
    const dir = join(OUT, 'components', c.group, c.name);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${c.name}.jsx`),
      `// Re-export of ${PKG} ${c.name}. Implementation is in the root _ds_bundle.js (window.${GLOBAL}).\n` +
      `Object.assign(window, { ${c.name}: window.${GLOBAL}.${c.name} });\n`);
    writeFileSync(join(dir, `${c.name}.d.ts`), rd(c.dts));
    const promptTxt = rd(c.prompt);
    promptHead[c.name] = promptTxt.split('\n', 1)[0].trim();
    writeFileSync(join(dir, `${c.name}.prompt.md`), promptTxt);
    const dsCard = `<!-- @dsCard group="${GROUP_LABELS[c.group] ?? 'Components'}" viewport="${c.viewport}" name="${c.name}" -->`;
    writeFileSync(join(dir, `${c.name}.html`),
      pageHtml({ dsCard, depth: 3, rootStyle: c.rootStyle, demoJs: await transform(demoFor(c)) }));
  }

  // 6) README = conventions header + repo README.
  const repoReadme = rd('README.md');
  const convPath = join(ROOT, '.design-sync', 'conventions.md');
  const headerFile = cfg.readmeHeader && existsSync(join(ROOT, cfg.readmeHeader))
    ? join(ROOT, cfg.readmeHeader) : (existsSync(convPath) ? convPath : null);
  const header = headerFile ? readFileSync(headerFile, 'utf8').trimEnd() + '\n\n---\n\n' : '';
  writeFileSync(join(OUT, 'README.md'), header + repoReadme);

  // 7) Local build metadata + sentinel.
  writeFileSync(join(OUT, '.ds-build-meta.json'), JSON.stringify({
    namespace: GLOBAL, source: PKG, shape: 'package', provider: null,
    componentCount: COMPONENTS.length, skippedStoryIds: [], runtimeFontPrefixes: [],
  }, null, 2) + '\n');
  writeFileSync(join(OUT, '_ds_needs_recompile'), JSON.stringify({ by: 'design-sync-cli' }));

  // 8) Bundle header.
  const bundleJs = join(OUT, '_ds_bundle.js');
  stampHeader(bundleJs, { namespace: GLOBAL, components: COMPONENTS.map((c) => ({ name: c.name, group: c.group })), inlinedExternals: [] });

  // 9) _ds_sync.json anchor.
  const bundleSha12 = createHash('sha256').update(readFileSync(bundleJs)).digest('hex').slice(0, 12);
  const renderHashes = {};
  for (const c of COMPONENTS) renderHashes[c.name] = renderHashFor(OUT, { name: c.name, group: c.group }, {});
  const sourceHashes = Object.fromEntries(COMPONENTS.flatMap((c) => {
    const base = `components/${c.group}/${c.name}/${c.name}`;
    return ['.jsx', '.d.ts', '.prompt.md'].map((e) => base + e)
      .filter((rel) => existsSync(join(OUT, rel)))
      .map((rel) => [rel, createHash('sha256').update(readFileSync(join(OUT, rel))).digest('hex').slice(0, 12)]);
  }));
  writeFileSync(join(OUT, '_ds_sync.json'), JSON.stringify({
    shape: 'package', keyRecipe: KEY_RECIPE,
    styleSha: styleShaFor(OUT, { includeBundleBody: true }),
    bundleSha12, renderHashes, sourceHashes,
    auxSha: auxShaFor(OUT), scriptsSha: scriptsShaFor(),
  }, null, 2) + '\n');

  // 10) Compositions (examples/) + full-screen templates (screens/).
  mkdirSync(join(OUT, 'examples'), { recursive: true });
  for (const ex of EXAMPLES) {
    writeFileSync(join(OUT, 'examples', `${ex.file}.html`),
      pageHtml({ depth: 1, rootStyle: 'padding:24px;background:#fff', demoJs: await transform(ex.demo) }));
  }
  mkdirSync(join(OUT, 'screens'), { recursive: true });
  for (const s of SCREENS) {
    writeFileSync(join(OUT, 'screens', `${s.file}.html`),
      pageHtml({ depth: 1, rootStyle: '', demoJs: await transform(s.demo) }));
  }

  // 11) index.html gallery. 파운데이션은 guidelines/ 견본의 @dsCard에서 수집.
  const foundations = existsSync(join(OUT, 'guidelines'))
    ? readdirSync(join(OUT, 'guidelines')).filter((f) => f.endsWith('.html')).sort().map((f) => {
        const first = readFileSync(join(OUT, 'guidelines', f), 'utf8').split('\n', 1)[0];
        const grab = (re) => re.exec(first)?.[1];
        const vh = grab(/viewport="\d+x(\d+)"/);
        return {
          file: f,
          group: grab(/group="([^"]*)"/) || 'Foundations',
          name: grab(/name="([^"]*)"/) || f.replace(/\.html$/, ''),
          subtitle: grab(/subtitle="([^"]*)"/) || '',
          h: vh ? Math.min(320, Math.max(120, Number(vh))) : 180,
        };
      })
    : [];
  // API schema (Props table + Code) + interactive playgrounds (local only).
  mkdirSync(join(OUT, '_playground'), { recursive: true });
  const apis = {};
  let pgCount = 0;
  for (const c of COMPONENTS) {
    const api = apiSchema(c);
    apis[c.name] = { props: api.props, code: codeForDemo(c), playground: api.playground };
    if (api.playground) { writeFileSync(join(OUT, '_playground', `${c.name}.html`), playgroundHtml(c, api.controllable)); pgCount++; }
  }
  writeFileSync(join(OUT, 'index.html'), galleryHtml(promptHead, foundations, apis));

  console.error(`\n✓ built ds-bundle/ — ${COMPONENTS.length} components, ${pgCount} playgrounds, ${EXAMPLES.length} examples, ${SCREENS.length} screens, bundleSha ${bundleSha12}`);
}

// ── index.html: 파운데이션 / 컴포넌트 / 예제 조합 / 화면 views ──
function galleryHtml(promptHead, foundations = [], apis = {}) {
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const byGroup = GROUP_ORDER
    .map((g) => ({ g, items: COMPONENTS.filter((c) => c.group === g) }))
    .filter((x) => x.items.length);
  const iframeH = (vp) => Math.min(460, Math.max(150, Number(String(vp).split('x')[1]) || 220));
  const openLink = (href) => `<a class="open" href="${href}" target="_blank" rel="noopener" title="새 탭에서 열기">↗</a>`;

  const fdGroups = [];
  for (const f of foundations) {
    let grp = fdGroups.find((x) => x.g === f.group);
    if (!grp) { grp = { g: f.group, items: [] }; fdGroups.push(grp); }
    grp.items.push(f);
  }

  const menuFoundations = fdGroups.map(({ g, items }) =>
    `<div class="menu-group"><a href="#fd-${slug(g)}" class="menu-h">${esc(g)} <span>${items.length}</span></a>` +
    items.map((f) => `<a href="#f-${slug(f.name)}" class="menu-i">${esc(f.name)}</a>`).join('') + `</div>`).join('\n');
  const menuComponents = byGroup.map(({ g, items }) =>
    `<div class="menu-group"><a href="#grp-${g}" class="menu-h">${GROUP_LABELS[g]} <span>${items.length}</span></a>` +
    items.map((c) => `<a href="#c-${c.name}" class="menu-i">${c.name}</a>`).join('') + `</div>`).join('\n');
  // 쇼케이스: 예제+화면을 합쳐 제목 가나다(ko) 순 평면 목록. 유형은 라벨로 표시.
  const showcaseItems = [
    ...EXAMPLES.map((e) => ({ ...e, dir: 'examples', prefix: 'ex', h: 420, type: '예제' })),
    ...SCREENS.map((s) => ({ ...s, dir: 'screens', prefix: 'sc', h: 720, type: '화면' })),
  ].sort((a, b) => a.title.localeCompare(b.title, 'ko'));
  const patMenuItem = (it) => `<a href="#${it.prefix}-${it.file}" class="menu-i pat-mi"><span class="mi-name"><span class="mi-type">${it.type}</span>${esc(it.title)}</span><span class="mi-sub">${esc(it.uses)}</span></a>`;
  const menuPatterns = showcaseItems.map(patMenuItem).join('');

  const foundationSections = fdGroups.map(({ g, items }) =>
    `<section class="grp" id="fd-${slug(g)}"><h2 class="grp-h">${esc(g)} <span class="grp-n">${items.length}</span></h2><div class="grid">` +
    items.map((f) => `<article class="card" id="f-${slug(f.name)}">
        <div class="card-h"><span class="c-name">${esc(f.name)}</span>${openLink(`guidelines/${f.file}`)}</div>
        ${f.subtitle ? `<p class="c-desc">${esc(f.subtitle)}</p>` : ''}
        <div class="frame"><iframe loading="lazy" src="guidelines/${f.file}" style="height:${f.h}px"></iframe></div>
      </article>`).join('\n') + `</div></section>`).join('\n');

  const componentSections = byGroup.map(({ g, items }) =>
    `<section class="grp" id="grp-${g}"><h2 class="grp-h">${GROUP_LABELS[g]} <span class="grp-n">${items.length}</span></h2><div class="grid">` +
    items.map((c) => {
      const api = apis[c.name] || { props: [], code: '', playground: false };
      const pg = api.playground ? `<a class="pg-link" href="_playground/${c.name}.html" target="_blank" rel="noopener">⚡ Playground</a>` : '';
      return `<article class="card" id="c-${c.name}" data-name="${esc((c.name + ' ' + (promptHead[c.name] || '')).toLowerCase())}">
        <div class="card-h"><span class="c-name">${c.name}</span><span class="card-meta"><span class="chip">${GROUP_LABELS[g]}</span><span class="vp">${esc(c.viewport)}</span>${openLink(`components/${c.group}/${c.name}/${c.name}.html`)}</span></div>
        <p class="c-desc">${esc(promptHead[c.name] || '')}</p>
        <div class="frame"><iframe loading="lazy" src="components/${c.group}/${c.name}/${c.name}.html" style="height:${iframeH(c.viewport)}px"></iframe></div>
        <div class="card-foot">
          ${pg}
          <details class="dd"><summary>Props ${api.props.length}</summary>${propsTableHtml(api.props)}</details>
          <details class="dd"><summary>코드</summary><pre class="code-block">${esc(api.code)}</pre><button class="copy-btn">복사</button></details>
          <details class="dd a11y-dd"><summary>a11y</summary><div class="a11y-out">스크롤하면 자동 검사…</div></details>
        </div>
      </article>`;
    }).join('\n') + `</div></section>`).join('\n');

  const patternBlock = (item, dir, id, h) => {
    const code = String(item.demo).replace(/\n?ReactDOM\.createRoot[\s\S]*$/, '').trim();
    const chips = item.uses.split('·').map((u) => `<span class="use-chip">${esc(u.trim())}</span>`).join('');
    const vp = dir === 'screens'
      ? `<div class="vp-toggle"><button class="vp-btn active" data-w="100%">데스크톱</button><button class="vp-btn" data-w="400px">모바일</button></div>`
      : '';
    return `<div class="pattern" id="${id}">
      <div class="pat-head"><h3 class="pat-h">${esc(item.title)}</h3><div class="pat-actions"><span class="pat-type">${esc(item.type || '')}</span>${vp}${openLink(`${dir}/${item.file}.html`)}</div></div>
      <div class="use-chips">${chips}</div>
      <div class="frame wide sc-frame"><iframe loading="lazy" src="${dir}/${item.file}.html" style="height:${h}px"></iframe></div>
      <details class="dd sc-code"><summary>코드</summary><pre class="code-block">${esc(code)}</pre><button class="copy-btn">복사</button></details>
    </div>`;
  };
  const patternsView = `<section class="grp">`
    + showcaseItems.map((it) => patternBlock(it, it.dir, `${it.prefix}-${it.file}`, it.h)).join('\n')
    + `</section>`;

  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Smalltalk 디자인 시스템</title>
<link rel="stylesheet" href="styles.css">
<style>
  :root{--muted:var(--gray-500);--line:var(--gray-200)}
  *{box-sizing:border-box}
  body{margin:0;font-family:var(--font-sans);color:var(--gray-900);background:var(--gray-50)}
  .topbar{position:sticky;top:0;z-index:40;display:flex;align-items:center;gap:14px;
    padding:12px 20px;background:#fff;border-bottom:1px solid var(--line)}
  .menu-toggle{display:none;align-items:center;justify-content:center;width:34px;height:34px;flex-shrink:0;
    border:1px solid var(--line);background:#fff;border-radius:var(--radius-lg);font-size:16px;cursor:pointer}
  .brand{font-weight:700;font-size:16px;white-space:nowrap}
  .brand .count{font-weight:500;font-size:12px;color:var(--muted);margin-left:8px}
  .tabs{display:flex;gap:4px;margin-left:auto;flex-wrap:wrap;justify-content:flex-end}
  .tabs button{border:1px solid var(--line);background:#fff;color:var(--gray-600);font-family:var(--font-sans);font-size:14px;
    font-weight:500;padding:7px 14px;border-radius:var(--radius-lg);cursor:pointer;transition:var(--transition-default)}
  .tabs button.active{background:var(--blue-600);border-color:transparent;color:#fff}
  .layout{display:flex;align-items:flex-start}
  .sidebar{position:sticky;top:57px;align-self:flex-start;width:230px;flex-shrink:0;height:calc(100vh - 57px);
    overflow:auto;padding:16px 12px;border-right:1px solid var(--line);background:#fff}
  .menu-group{margin-bottom:10px}
  .menu-h{display:flex;justify-content:space-between;align-items:center;text-decoration:none;color:var(--gray-900);
    font-weight:600;font-size:13px;padding:6px 8px;text-transform:uppercase;letter-spacing:.02em;border-radius:6px}
  .menu-h span{font-weight:500;color:var(--gray-400)}
  .menu-h.active{color:var(--blue-600)}
  .menu-i{display:block;text-decoration:none;color:var(--gray-500);font-size:13px;padding:5px 8px 5px 14px;border-radius:6px}
  .menu-i:hover{background:var(--gray-50);color:var(--blue-600)}
  .menu-i.active{background:var(--blue-50);color:var(--blue-600);font-weight:600}
  .search{width:100%;padding:8px 10px;margin:0 0 12px;font-family:var(--font-sans);font-size:13px;
    border:1px solid var(--line);border-radius:var(--radius-lg);outline:none;background:var(--gray-50)}
  .search:focus{box-shadow:0 0 0 2px var(--blue-500);background:#fff}
  main{flex:1;min-width:0;padding:24px 28px 80px}
  .grp{margin-bottom:36px;scroll-margin-top:72px}
  .grp-h{position:sticky;top:57px;z-index:5;background:var(--gray-50);font-size:15px;font-weight:700;margin:0 0 4px;padding:8px 0;display:flex;align-items:center;gap:8px}
  .grp-h .grp-n{font-weight:500;color:var(--gray-400);font-size:13px}
  .ex-uses{margin:0 0 14px;font-size:13px;color:var(--muted)}
  .pattern{margin-bottom:20px;scroll-margin-top:110px;border:1px solid var(--line);border-radius:var(--radius-xl);background:#fff;padding:14px 16px}
  .pat-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
  .pat-h{font-size:14px;font-weight:600;margin:0;display:flex;align-items:center;gap:8px}
  .pat-actions{display:flex;align-items:center;gap:10px;flex-shrink:0}
  .use-chips{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0 12px}
  .use-chip{font-size:11px;color:var(--gray-500);background:var(--gray-100);padding:2px 7px;border-radius:var(--radius-full)}
  .vp-toggle{display:inline-flex;border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden}
  .vp-btn{font-family:var(--font-sans);font-size:11px;font-weight:500;padding:4px 10px;border:none;background:#fff;color:var(--gray-600);cursor:pointer}
  .vp-btn+.vp-btn{border-left:1px solid var(--line)}
  .vp-btn.active{background:var(--blue-600);color:#fff}
  .sc-frame{background:var(--gray-50)}
  .sc-frame iframe{margin:0 auto;transition:width .2s}
  .sc-code{margin-top:10px}
  .menu-i.pat-mi{padding:6px 8px 6px 14px}
  .mi-name{display:block;font-size:13px}
  .mi-sub{display:block;font-size:10px;color:var(--gray-400);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .menu-i.pat-mi.active .mi-sub{color:var(--blue-400)}
  .mi-type{display:inline-block;font-size:9px;font-weight:600;color:var(--gray-500);background:var(--gray-100);padding:1px 5px;border-radius:var(--radius-full);margin-right:6px;vertical-align:middle}
  .pat-type{font-size:11px;font-weight:500;color:var(--gray-500);background:var(--gray-100);padding:2px 8px;border-radius:var(--radius-full)}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;margin-top:12px}
  .card{border:1px solid var(--line);border-radius:var(--radius-xl);background:#fff;overflow:hidden;scroll-margin-top:110px;transition:var(--transition-default)}
  .card:hover{border-color:var(--blue-400);box-shadow:var(--shadow-sm)}
  .card-h{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px 0}
  .card-meta{display:flex;align-items:center;gap:8px;flex-shrink:0}
  .vp{font-size:11px;color:var(--gray-400);font-family:var(--font-mono)}
  .chip{font-size:11px;font-weight:500;color:var(--gray-500);background:var(--gray-100);padding:2px 8px;border-radius:var(--radius-full);white-space:nowrap}
  .open{font-size:14px;color:var(--gray-400);text-decoration:none;line-height:1}
  .open:hover{color:var(--blue-600)}
  .c-name{font-weight:600;font-size:14px}
  .c-desc{margin:6px 14px 10px;font-size:12px;color:var(--muted);line-height:1.5;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .card-foot{border-top:1px solid var(--line);padding:8px 12px;display:flex;flex-direction:column;gap:6px}
  .pg-link{align-self:flex-start;font-size:12px;font-weight:600;color:var(--blue-600);text-decoration:none;
    padding:4px 10px;border:1px solid var(--blue-100);background:var(--blue-50);border-radius:var(--radius-lg)}
  .pg-link:hover{background:var(--blue-100)}
  .dd>summary{cursor:pointer;font-size:12px;font-weight:600;color:var(--gray-600);padding:4px 0;list-style:none}
  .dd>summary::-webkit-details-marker{display:none}
  .dd>summary::before{content:"▸ ";color:var(--gray-400)}
  .dd[open]>summary{color:var(--blue-600)} .dd[open]>summary::before{content:"▾ "}
  table.props{width:100%;border-collapse:collapse;font-size:12px;margin:6px 0}
  table.props th{text-align:left;color:var(--gray-400);font-weight:600;padding:4px 6px;border-bottom:1px solid var(--line)}
  table.props td{padding:4px 6px;border-bottom:1px solid var(--gray-100);vertical-align:top}
  table.props code{font-family:var(--font-mono);font-size:11px}
  table.props code.ty{color:var(--blue-600)} table.props .req{color:var(--red-500)}
  .pg-empty{font-size:12px;color:var(--gray-400);margin:6px 0}
  pre.code-block{background:var(--gray-900);color:#e5e7eb;font-family:var(--font-mono);font-size:11px;line-height:1.6;
    padding:10px;border-radius:var(--radius-lg);overflow:auto;white-space:pre-wrap;word-break:break-word;margin:6px 0}
  .copy-btn{align-self:flex-start;font-family:var(--font-sans);font-size:11px;font-weight:500;padding:4px 10px;
    border:1px solid var(--line);background:#fff;border-radius:var(--radius-lg);cursor:pointer}
  .copy-btn:hover{border-color:var(--blue-400);color:var(--blue-600)}
  .a11y-out{font-size:12px;line-height:1.7;color:var(--gray-500)}
  .a11y-ok{color:var(--green-700);font-weight:600}
  .a11y-item{font-weight:500} .a11y-item.err{color:var(--red-600)} .a11y-item.warn{color:var(--orange-700)}
  .frame{border-top:1px solid var(--line);background:#fff}
  .frame iframe{width:100%;border:0;display:block}
  .frame.wide{border:1px solid var(--line);border-radius:var(--radius-lg);margin-top:2px}
  .backdrop{display:none}
  [hidden]{display:none !important}
  @media(max-width:720px){
    .menu-toggle{display:inline-flex}
    .sidebar{position:fixed;top:57px;left:0;bottom:0;width:250px;height:auto;transform:translateX(-100%);
      transition:transform .2s;z-index:35;box-shadow:0 10px 30px rgba(0,0,0,.14)}
    .sidebar.open{transform:none}
    .backdrop.show{display:block;position:fixed;inset:57px 0 0 0;background:rgba(0,0,0,.3);z-index:34}
    main{padding:20px 16px 60px}
    .brand .count{display:none}
    .tabs button{padding:6px 10px;font-size:13px}
  }
</style>
</head><body>
<header class="topbar">
  <button class="menu-toggle" aria-label="메뉴 열기">☰</button>
  <div class="brand">Smalltalk 디자인 시스템 <span class="count">${foundations.length}개 파운데이션 · ${COMPONENTS.length}개 컴포넌트 · ${EXAMPLES.length}개 예제 · ${SCREENS.length}개 화면</span></div>
  <nav class="tabs">
    <button data-view="foundations">파운데이션</button>
    <button data-view="components" class="active">컴포넌트</button>
    <button data-view="patterns">쇼케이스</button>
  </nav>
</header>
<div class="backdrop"></div>
<div class="layout">
  <aside class="sidebar">
    <div id="menu-foundations" hidden>${menuFoundations}</div>
    <div id="menu-components"><input id="search" class="search" type="search" placeholder="컴포넌트 검색…" autocomplete="off">${menuComponents}</div>
    <div id="menu-patterns" hidden>${menuPatterns}</div>
  </aside>
  <main>
    <div id="view-foundations" hidden>${foundationSections}</div>
    <div id="view-components">${componentSections}</div>
    <div id="view-patterns" hidden>${patternsView}</div>
  </main>
</div>
<script>
  var VIEWS=['foundations','components','patterns'];
  var btns=document.querySelectorAll('.tabs button');
  var sidebar=document.querySelector('.sidebar');
  var backdrop=document.querySelector('.backdrop');
  function closeNav(){sidebar.classList.remove('open');backdrop.classList.remove('show');}
  function show(v){
    btns.forEach(function(b){b.classList.toggle('active',b.dataset.view===v)});
    VIEWS.forEach(function(name){
      var view=document.getElementById('view-'+name); if(view)view.hidden=name!==v;
      var menu=document.getElementById('menu-'+name); if(menu)menu.hidden=name!==v;
    });
    closeNav(); window.scrollTo(0,0);
  }
  btns.forEach(function(b){b.addEventListener('click',function(){show(b.dataset.view)})});
  var toggle=document.querySelector('.menu-toggle');
  if(toggle)toggle.addEventListener('click',function(){sidebar.classList.toggle('open');backdrop.classList.toggle('show');});
  backdrop.addEventListener('click',closeNav);
  sidebar.addEventListener('click',function(e){ if(e.target.closest('a')) closeNav(); });

  var search=document.getElementById('search');
  if(search){search.addEventListener('input',function(){
    var q=search.value.trim().toLowerCase();
    document.querySelectorAll('#view-components .card').forEach(function(c){ c.hidden = q!=='' && c.dataset.name.indexOf(q)<0; });
    document.querySelectorAll('#view-components .grp').forEach(function(s){ s.hidden = !s.querySelector('.card:not([hidden])'); });
    document.querySelectorAll('#menu-components .menu-i').forEach(function(a){ a.hidden = q!=='' && a.textContent.toLowerCase().indexOf(q)<0; });
  });}

  // scrollspy — highlight the sidebar entry for the section in view
  var links={};
  document.querySelectorAll('.sidebar a[href^="#"]').forEach(function(a){ links[a.getAttribute('href').slice(1)]=a; });
  var spy=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting)return;
      var a=links[e.target.id]; if(!a)return;
      Object.keys(links).forEach(function(k){links[k].classList.remove('active')});
      a.classList.add('active');
      a.scrollIntoView({block:'nearest'});
    });
  },{rootMargin:'-90px 0px -75% 0px',threshold:0});
  document.querySelectorAll('main [id]').forEach(function(el){ if(links[el.id]) spy.observe(el); });

  // 코드 복사
  document.addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('.copy-btn'):null; if(!b)return;
    var pre=b.parentNode.querySelector('pre'); if(!pre)return;
    if(navigator.clipboard)navigator.clipboard.writeText(pre.textContent);
    b.textContent='복사됨 ✓'; setTimeout(function(){b.textContent='복사'},1200);
  });

  // 쇼케이스 화면: 데스크톱/모바일 뷰포트 토글
  document.addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('.vp-btn'):null; if(!b)return;
    var pat=b.closest('.pattern'); if(!pat)return; var fr=pat.querySelector('iframe');
    pat.querySelectorAll('.vp-btn').forEach(function(x){x.classList.remove('active')}); b.classList.add('active');
    if(fr)fr.style.width=b.dataset.w;
  });

  // a11y 자동 검사 — 각 카드의 렌더된 iframe DOM을 휴리스틱으로 점검
  function a11yCheck(doc){
    var b=doc.body, out=[];
    b.querySelectorAll('button,a[href],[role=button],[role=switch],[role=tab]').forEach(function(el){
      var n=(el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')||el.textContent||'').trim();
      if(!n) out.push({lv:'err',m:'접근 이름 없는 '+(el.getAttribute('role')||el.tagName.toLowerCase())});
    });
    b.querySelectorAll('img').forEach(function(el){ if(!el.hasAttribute('alt')) out.push({lv:'err',m:'alt 없는 이미지'}); });
    b.querySelectorAll('input,select,textarea').forEach(function(el){
      if(el.type==='hidden')return;
      var named=el.getAttribute('aria-label')||el.getAttribute('aria-labelledby')||el.closest('label')||el.placeholder||(el.id&&doc.querySelector('label[for="'+el.id+'"]'));
      if(!named) out.push({lv:'warn',m:'라벨 없는 폼 요소'});
    });
    var focusable=b.querySelectorAll('button:not([disabled]),a[href],input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])').length;
    return {items:out,focusable:focusable};
  }
  function renderA11y(r){
    var map={}; r.items.forEach(function(i){ var k=i.lv+'|'+i.m; map[k]=(map[k]||0)+1; });
    var keys=Object.keys(map);
    if(!keys.length) return '<span class="a11y-ok">✓ 자동 검사 통과</span> · 포커스 가능 '+r.focusable+'개';
    return keys.map(function(k){ var p=k.split('|'), n=map[k]; return '<div class="a11y-item '+p[0]+'">'+(p[0]==='err'?'✗':'⚠')+' '+p[1]+(n>1?' ×'+n:'')+'</div>'; }).join('')
      +'<div style="color:var(--gray-400);margin-top:4px">포커스 가능 '+r.focusable+'개 · 휴리스틱</div>';
  }
  document.querySelectorAll('#view-components .card').forEach(function(card){
    var fr=card.querySelector('iframe'), outEl=card.querySelector('.a11y-out'); if(!fr||!outEl)return;
    function run(){ try{ var doc=fr.contentDocument; if(!doc||!doc.body){outEl.textContent='검사 불가';return;} outEl.innerHTML=renderA11y(a11yCheck(doc)); }catch(e){ outEl.textContent='검사 불가'; } }
    fr.addEventListener('load',function(){ setTimeout(run,400); });
    if(fr.contentDocument&&fr.contentDocument.body&&fr.contentDocument.readyState==='complete') setTimeout(run,400);
  });
</script>
</body></html>
`;
}

main().catch((e) => { console.error(e); process.exit(1); });
