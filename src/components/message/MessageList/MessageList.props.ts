import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IChat, IMessage, IUser } from "utils/interface";

export interface MessageListProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  chat: IChat | undefined;
  haveMessage: Date | null;
  user: IUser | undefined;
  messagesBegore: IMessage[] | undefined;
  messages: IMessage[] | undefined;
}
