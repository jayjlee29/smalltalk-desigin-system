import * as React from "react";

export interface SidebarItem {
  label: React.ReactNode;
  href?: string;
  active?: boolean;
  count?: number;
  icon?: React.ReactNode;
  /** Render as a section heading instead of a nav link. */
  section?: boolean;
}

export interface SidebarProps {
  /** @startingPoint section="Community" subtitle="Vertical side navigation menu w/ sections + counts" viewport="320x340" */
  items: SidebarItem[];
  header?: React.ReactNode;
}

export declare function Sidebar(props: SidebarProps): JSX.Element;
