import * as React from "react";

export interface TabItem {
  key: string;
  label: React.ReactNode;
}

export interface TabsProps {
  /** @startingPoint section="Portfolio" subtitle="Underline tabs, blue-600 active indicator" viewport="600x120" */
  tabs: TabItem[];
  value?: string;
  onChange?: (key: string) => void;
}

export declare function Tabs(props: TabsProps): JSX.Element;
