import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SearchProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  value: string;
  setValue: (val: string) => void;
  setSearchUser?: (val: boolean) => void;
  setMenu?: (val: boolean) => void;
}
