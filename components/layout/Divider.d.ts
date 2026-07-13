import * as React from "react";

export interface DividerProps {
  /** @startingPoint section="Community" subtitle="Horizontal/vertical rule, optional center label" viewport="500x120" */
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
  spacing?: number;
}

export declare function Divider(props: DividerProps): JSX.Element;
