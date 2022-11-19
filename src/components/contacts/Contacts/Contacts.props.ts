import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

export interface ContactsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  searchContact: RefObject<HTMLInputElement>;
}
