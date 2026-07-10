import * as React from "react";

export interface ToastProviderProps {
  /** @startingPoint section="Community" subtitle="Bottom-right stacked toast notifications" viewport="500x220" */
  children?: React.ReactNode;
}

export declare function ToastProvider(props: ToastProviderProps): JSX.Element;
export declare function useToast(): { addToast: (message: string, type?: "error" | "success" | "info") => void };
