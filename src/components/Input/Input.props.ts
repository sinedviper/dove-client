import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface InputProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  placeholderName: string;
  error?: boolean;
}
