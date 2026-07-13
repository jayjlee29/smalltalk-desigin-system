import * as React from "react";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbProps {
  /** @startingPoint section="Community" subtitle="Path trail, slash-separated, current in gray-900" viewport="600x80" */
  items: BreadcrumbItem[];
}

export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;
