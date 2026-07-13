import * as React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** @startingPoint section="Community" subtitle="Native dropdown w/ chevron, focus ring" viewport="500x140" */
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export declare function Select(props: SelectProps): JSX.Element;
