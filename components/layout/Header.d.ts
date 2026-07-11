import * as React from "react";

export interface HeaderLink {
  label: string;
  href?: string;
  active?: boolean;
}

export interface HeaderProps {
  /** @startingPoint section="Community" subtitle="Sticky app bar: wordmark, nav links, right slot" viewport="800x100" */
  brand?: string;
  links?: HeaderLink[];
  right?: React.ReactNode;
}

export declare function Header(props: HeaderProps): JSX.Element;
