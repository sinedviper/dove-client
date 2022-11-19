import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface ButtonMenuProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  menu: boolean;
  top: number;
  left: number;
  handleDelete: VoidFunction;
  text: string;
}
