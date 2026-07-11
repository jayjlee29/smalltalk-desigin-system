import * as React from "react";

export interface ReplyFormProps {
  /** @startingPoint section="Community" subtitle="Nested reply composer (indented, compact)" viewport="600x200" */
  onSubmit?: (body: string) => void;
  onCancel?: () => void;
  replyingTo?: string;
}

export declare function ReplyForm(props: ReplyFormProps): JSX.Element;
