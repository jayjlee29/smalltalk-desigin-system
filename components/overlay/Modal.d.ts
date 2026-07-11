import * as React from "react";

export interface ModalProps {
  /** @startingPoint section="Community" subtitle="Centered dialog w/ title, body, footer actions" viewport="600x420" */
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

export declare function Modal(props: ModalProps): JSX.Element | null;
