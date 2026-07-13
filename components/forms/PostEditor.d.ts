import * as React from "react";
import type { SelectOption } from "./Select";

export interface PostEditorValue {
  category: string;
  title: string;
  body: string;
  tags: string[];
}

export interface PostEditorProps {
  /** @startingPoint section="Community" subtitle="Board post-writing form: category, title, body, tags" viewport="640x600" */
  categories?: SelectOption[];
  /** Body editor module: 기본 Textarea / TipTap / Novel. */
  editor?: "basic" | "tiptap" | "novel";
  onSubmit?: (value: PostEditorValue) => void;
  onCancel?: () => void;
  defaultCategory?: string;
  defaultTitle?: string;
  defaultBody?: string;
  defaultTags?: string[];
}

export declare function PostEditor(props: PostEditorProps): JSX.Element;
