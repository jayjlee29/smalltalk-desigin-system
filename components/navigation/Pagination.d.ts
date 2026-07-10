import * as React from "react";

export interface PaginationProps {
  /** @startingPoint section="Community" subtitle="Numbered page buttons, blue-600 active state" viewport="500x80" */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export declare function Pagination(props: PaginationProps): JSX.Element;
