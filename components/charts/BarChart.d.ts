import * as React from "react";

export interface BarDatum {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  /** @startingPoint section="Portfolio" subtitle="Vertical bar chart, DS chart palette" viewport="480x240" */
  data: BarDatum[];
  height?: number;
  color?: string;
  showValues?: boolean;
}

export declare function BarChart(props: BarChartProps): JSX.Element;
