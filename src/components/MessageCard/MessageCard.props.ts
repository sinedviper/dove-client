import { IChat } from "./../../interface/IChat";
import { IMessage } from "./../../interface/IMessage";
import { IUser } from "./../../interface/IUser";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MessageCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  chat: IChat | null;
  message: IMessage;
  index: number;
  username: string;
  messages: IMessage[];
  user: IUser | null;
}
