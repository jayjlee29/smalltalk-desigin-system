import * as React from "react";

export interface EditorProps {
  /** @startingPoint section="Community" subtitle="Post body editor: basic / TipTap / Novel" viewport="640x760" */
  variant?: "basic" | "tiptap" | "novel";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

export declare function Editor(props: EditorProps): JSX.Element;
