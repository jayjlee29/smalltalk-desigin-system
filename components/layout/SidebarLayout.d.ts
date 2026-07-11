import * as React from "react";

export interface SidebarNavItem {
  label: React.ReactNode;
  href?: string;
  active?: boolean;
  count?: number;
}

export interface SidebarLayoutProps {
  /** @startingPoint section="Portfolio" subtitle="Sticky sidebar nav + main content column" viewport="760x300" */
  nav?: SidebarNavItem[];
  title?: React.ReactNode;
  sidebarWidth?: number;
  children?: React.ReactNode;
}

export declare function SidebarLayout(props: SidebarLayoutProps): JSX.Element;
