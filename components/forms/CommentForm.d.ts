import * as React from "react";

export interface CommentSubmit {
  nickname: string;
  password: string;
  body: string;
}

export interface CommentFormProps {
  /** @startingPoint section="Community" subtitle="Comment composer: avatar, nickname/password, body" viewport="640x260" */
  onSubmit?: (value: CommentSubmit) => void;
  /** Anonymous mode shows nickname + password fields (no account). Default true. */
  anonymous?: boolean;
  author?: string;
}

export declare function CommentForm(props: CommentFormProps): JSX.Element;
