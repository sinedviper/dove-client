import { IUser } from "interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface CardContactProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  contact: IUser;
  setContact: Function;
  setValue: Function;
  search?: boolean;
}
