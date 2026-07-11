import * as React from "react";

export interface TagProps {
  /** @startingPoint section="Community" subtitle="Small tag chip, optional remove button" viewport="500x100" */
  children?: React.ReactNode;
  onRemove?: () => void;
  tone?: "gray" | "blue";
}

export declare function Tag(props: TagProps): JSX.Element;
