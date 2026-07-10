import * as React from "react";

export interface CardProps {
  /** @startingPoint section="Portfolio" subtitle="Bordered panel, optional gradient/hover elevation" viewport="700x160" */
  elevated?: boolean;
  hoverable?: boolean;
  gradient?: boolean;
  padding?: number;
  children?: React.ReactNode;
}

export declare function Card(props: CardProps): JSX.Element;
