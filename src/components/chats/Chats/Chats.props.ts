import { DetailedHTMLProps, HTMLAttributes, RefObject } from "react";

export interface ChatsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  searchContact: RefObject<HTMLInputElement> | null;
}
