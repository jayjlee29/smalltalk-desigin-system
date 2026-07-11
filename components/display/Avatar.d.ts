import * as React from "react";

export interface AvatarProps {
  /** @startingPoint section="Community" subtitle="User avatar: image or initials fallback" viewport="500x120" */
  name?: string;
  src?: string;
  size?: number;
}

export declare function Avatar(props: AvatarProps): JSX.Element;
