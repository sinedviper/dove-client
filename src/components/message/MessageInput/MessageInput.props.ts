import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MessageInputProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  main: boolean;
}
