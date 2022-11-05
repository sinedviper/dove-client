import { IChatResponse } from "interface";
import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

export interface ChatsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  chats: IChatResponse | null;
  searchContact: RefObject<HTMLInputElement>;
  setContact: Function;
  setSettings: Function;
  valueAll: string;
  setValueAll: Function;
}
