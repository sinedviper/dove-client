import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

import { IContactResponse } from "interface";

export interface ContactsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  contacts: IContactResponse | null;
  searchContact: RefObject<HTMLInputElement>;
  setContact: Function;
  contact: boolean;
}
