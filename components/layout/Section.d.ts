import * as React from "react";

export interface SectionProps {
  /** @startingPoint section="Community" subtitle="Titled content block w/ optional actions" viewport="620x200" */
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export declare function Section(props: SectionProps): JSX.Element;
