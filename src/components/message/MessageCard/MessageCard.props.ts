import { IChat } from "../../../utils/interface/IChat";
import { IMessage } from "../../../utils/interface/IMessage";
import { IUser } from "../../../utils/interface/IUser";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MessageCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  chat: IChat | undefined;
  message: IMessage;
  index: number;
  messages: IMessage[];
  user: IUser | undefined;
}
