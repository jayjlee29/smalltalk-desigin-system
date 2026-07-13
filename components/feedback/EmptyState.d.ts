import * as React from "react";

export interface EmptyStateProps {
  /** @startingPoint section="Community" subtitle="Empty list placeholder w/ optional action" viewport="500x220" */
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export declare function EmptyState(props: EmptyStateProps): JSX.Element;
