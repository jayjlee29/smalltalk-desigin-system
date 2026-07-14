import * as React from "react";

export interface AppShellProps {
  /** @startingPoint section="Community" subtitle="Standard app shell: Header + content (+Sidebar) + Footer" viewport="960x720" */
  /** 상단에 고정될 Header 요소. */
  header?: React.ReactNode;
  /** 하단 Footer 요소. padded 본문 밖(전체 폭)에 렌더된다. */
  footer?: React.ReactNode;
  /** 중앙 콘텐츠. SidebarLayout, PageHeader, 카드 등을 넣는다. */
  children?: React.ReactNode;
  /** 본문 최대 폭(px). 기본 1120. */
  maxWidth?: number;
  /** 페이지 배경. 기본 --gray-50. */
  background?: string;
}

export declare function AppShell(props: AppShellProps): JSX.Element;
