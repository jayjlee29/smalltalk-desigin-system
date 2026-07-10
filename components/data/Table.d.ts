import * as React from "react";

export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: number | string;
  mono?: boolean;
  render?: (row: any) => React.ReactNode;
}

export interface TableProps {
  /** @startingPoint section="Portfolio" subtitle="Holdings/data table, gray-50 header" viewport="700x220" */
  columns: TableColumn[];
  rows: any[];
  rowKey?: string;
}

export declare function Table(props: TableProps): JSX.Element;
