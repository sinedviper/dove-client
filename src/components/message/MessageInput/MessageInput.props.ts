import { IChat } from "../../../utils/interface/IChat";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IUser } from "utils/interface";

export interface MessageInputProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  chat: IChat | undefined;
  user: IUser | undefined;
}
