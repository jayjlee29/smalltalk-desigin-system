import * as React from "react";

export interface ContainerProps {
  /** @startingPoint section="Community" subtitle="Centered max-width content column" viewport="700x200" */
  size?: "content" | "form" | "full";
  padding?: number;
  children?: React.ReactNode;
}

export declare function Container(props: ContainerProps): JSX.Element;
