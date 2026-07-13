import * as React from "react";

export interface CheckboxProps {
  /** @startingPoint section="Community" subtitle="Checkbox w/ blue-600 checked state + label" viewport="500x120" */
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}

export declare function Checkbox(props: CheckboxProps): JSX.Element;
