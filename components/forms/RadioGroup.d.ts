import * as React from "react";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
}

export interface RadioGroupProps {
  /** @startingPoint section="Community" subtitle="Radio options, vertical or horizontal" viewport="500x140" */
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  name?: string;
  direction?: "vertical" | "horizontal";
}

export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
