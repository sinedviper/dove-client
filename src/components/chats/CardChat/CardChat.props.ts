import { IChat } from "utils/interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface CardChatProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  chat: IChat;
}
