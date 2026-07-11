import * as React from "react";

export interface SkeletonProps {
  /** @startingPoint section="Community" subtitle="Loading placeholder, animate-pulse gray blocks" viewport="500x160" */
  width?: number | string;
  height?: number | string;
  radius?: string;
  count?: number;
}

export declare function Skeleton(props: SkeletonProps): JSX.Element;
