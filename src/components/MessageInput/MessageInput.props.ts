import { IChat } from "./../../interface/IChat";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IUser } from "interface";

export interface MessageInputProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  chat: IChat | null;
  user: IUser | null;
}
