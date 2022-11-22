import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MessageHeaderProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  setSettings: Function;
}
