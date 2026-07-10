import * as React from "react";

export interface BadgeProps {
  /** @startingPoint section="Community" subtitle="Status pill / account-type / tag badge" viewport="700x100" */
  tone?: "blue" | "gray" | "green" | "purple" | "orange";
  pill?: boolean;
  children?: React.ReactNode;
}

export declare function Badge(props: BadgeProps): JSX.Element;
