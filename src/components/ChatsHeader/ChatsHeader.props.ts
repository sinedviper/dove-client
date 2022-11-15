import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

export interface ChatsHeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setSwiper: Function;
  setSearchUser: Function;
  searchUser: boolean;
  searchContact: RefObject<HTMLInputElement>;
  setContact: Function;
  setSettings: Function;
  valueAll: string;
  setValueAll: Function;
  handleSearch: VoidFunction;
}
