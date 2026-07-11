import * as React from "react";

export interface SplitProps {
  /** @startingPoint section="Portfolio" subtitle="Two-pane split with a column ratio" viewport="640x180" */
  left?: React.ReactNode;
  right?: React.ReactNode;
  ratio?: string;
  gap?: number;
}

export declare function Split(props: SplitProps): JSX.Element;
