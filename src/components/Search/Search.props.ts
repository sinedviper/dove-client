import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SearchProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  value: string;
  setValue: Function;
}
