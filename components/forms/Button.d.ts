import * as React from "react";

export interface ButtonProps {
  /** @startingPoint section="Community" subtitle="Primary / secondary / danger / ghost button" viewport="700x120" */
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  children?: React.ReactNode;
}

export declare function Button(props: ButtonProps): JSX.Element;
