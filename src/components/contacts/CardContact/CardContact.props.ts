import { IUser } from "utils/interface";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface CardContactProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLLIElement> {
  contact: IUser;
  handleFocus?: VoidFunction;
  setValue: Function;
  search?: boolean;
}
