import * as React from "react";

export interface AlertProps {
  /** @startingPoint section="Community" subtitle="Inline banner: info / success / warning / error" viewport="600x200" */
  tone?: "info" | "success" | "warning" | "error";
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClose?: () => void;
}

export declare function Alert(props: AlertProps): JSX.Element;
