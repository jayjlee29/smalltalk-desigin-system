import * as React from "react";

export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterProps {
  /** @startingPoint section="Community" subtitle="Page footer: brand, links, note" viewport="720x160" */
  brand?: string;
  links?: FooterLink[];
  note?: React.ReactNode;
}

export declare function Footer(props: FooterProps): JSX.Element;
