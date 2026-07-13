import * as React from "react";

export interface TextareaProps {
  /** @startingPoint section="Community" subtitle="Multiline text field w/ label, error, focus ring" viewport="700x180" */
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  rows?: number;
  required?: boolean;
  maxLength?: number;
}

export declare function Textarea(props: TextareaProps): JSX.Element;
