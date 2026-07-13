import * as React from "react";

export interface GridProps {
  /** @startingPoint section="Community" subtitle="Responsive grid; fixed columns or auto-fill minItemWidth" viewport="640x220" */
  columns?: number;
  gap?: number;
  minItemWidth?: number | string;
  children?: React.ReactNode;
}

export declare function Grid(props: GridProps): JSX.Element;
