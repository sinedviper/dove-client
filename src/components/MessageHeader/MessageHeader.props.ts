import { IUser } from "interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MessageHeaderProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  setSettings: Function;
  receipt: IUser | undefined;
}
