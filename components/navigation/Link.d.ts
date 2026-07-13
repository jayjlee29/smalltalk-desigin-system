import * as React from "react";

export interface LinkProps {
  /** @startingPoint section="Community" subtitle="Text link, blue-600, optional external marker" viewport="500x100" */
  href?: string;
  children?: React.ReactNode;
  external?: boolean;
  muted?: boolean;
}

export declare function Link(props: LinkProps): JSX.Element;
