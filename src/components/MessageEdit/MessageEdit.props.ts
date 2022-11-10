import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MessageEditProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  setEditMessage: Function;
  editMessage: boolean;
  client: {
    clientX: number;
    clientY: number;
    id: number;
    chatId: number;
    senderMessage: number;
    text: string;
    user: number;
  };
}
