import * as React from "react";

export interface PageHeaderProps {
  /** @startingPoint section="Community" subtitle="Page title + subtitle + action buttons row" viewport="700x140" */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export declare function PageHeader(props: PageHeaderProps): JSX.Element;
