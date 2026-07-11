import * as React from "react";

export interface SwitchProps {
  /** @startingPoint section="Community" subtitle="Toggle switch, blue-600 on-state" viewport="500x100" */
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}

export declare function Switch(props: SwitchProps): JSX.Element;
