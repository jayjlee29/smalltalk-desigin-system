import * as React from "react";

export interface InputProps {
  /** @startingPoint section="Community" subtitle="Text input w/ label, error, focus ring" viewport="700x160" */
  type?: "text" | "password";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  label?: string;
  autoComplete?: string;
  required?: boolean;
  compact?: boolean;
}

export declare function Input(props: InputProps): JSX.Element;
