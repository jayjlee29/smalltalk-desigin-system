import * as React from "react";

export interface StackProps {
  /** @startingPoint section="Community" subtitle="Flex stack, vertical or horizontal, with gap" viewport="560x180" */
  direction?: "vertical" | "horizontal";
  gap?: number;
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  wrap?: boolean;
  children?: React.ReactNode;
}

export declare function Stack(props: StackProps): JSX.Element;
