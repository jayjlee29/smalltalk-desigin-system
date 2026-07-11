import * as React from "react";

export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  /** @startingPoint section="Portfolio" subtitle="Donut/pie chart w/ legend (SVG)" viewport="480x200" */
  data: DonutDatum[];
  size?: number;
  thickness?: number;
}

export declare function DonutChart(props: DonutChartProps): JSX.Element;
