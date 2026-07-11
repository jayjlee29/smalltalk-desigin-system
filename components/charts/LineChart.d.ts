import * as React from "react";

export interface LineDatum {
  label: string;
  value: number;
}

export interface LineChartProps {
  /** @startingPoint section="Portfolio" subtitle="Line/area trend chart (SVG)" viewport="480x220" */
  data: LineDatum[];
  height?: number;
  color?: string;
  area?: boolean;
}

export declare function LineChart(props: LineChartProps): JSX.Element;
