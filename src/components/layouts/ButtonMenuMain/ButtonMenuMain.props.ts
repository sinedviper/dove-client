import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface ButtonMenuMainProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  handleAction: VoidFunction;
  text: string;
  action: string;
  animation?: boolean;
  theme?: boolean;
}
