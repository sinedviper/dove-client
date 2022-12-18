import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IUser, IMessage, IChat } from "utils/interface";
export interface MessageCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  chat: IChat | undefined;
  message: IMessage;
  index: number;
  messages: IMessage[];
  user: IUser | undefined;
}
