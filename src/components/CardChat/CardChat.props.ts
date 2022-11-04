import { IChat } from "interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface CardChatProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  contact: IChat;
}
