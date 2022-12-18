import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MessageEditProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setEditMessage: (val: boolean) => void;
  editMessage: boolean;
  clientX: number;
  clientY: number;
  client: {
    id: number;
    chatId: number;
    senderMessage: number;
    text: string;
    user: number;
  };
  position: boolean;
}
