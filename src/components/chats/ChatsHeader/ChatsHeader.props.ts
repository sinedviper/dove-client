import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

export interface ChatsHeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setSwiper: (val: boolean) => void;
  setSearchUser: (val: boolean) => void;
  searchUser: boolean;
  searchContact: RefObject<HTMLInputElement> | null;
  valueAll: string;
  setValueAll: (val: string) => void;
}
