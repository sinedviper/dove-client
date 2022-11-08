import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

import { IUser } from "interface";

export interface ContactsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  contacts: IUser[] | null;
  searchContact: RefObject<HTMLInputElement>;
  setContact: Function;
  contact: boolean;
}
