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
  /** 지정 시 내부 콘텐츠를 이 폭으로 중앙 정렬(본문과 좌우 정렬 맞춤). 미지정 시 좌우 clamp 패딩만. */
  maxWidth?: number;
}

export declare function Footer(props: FooterProps): JSX.Element;
