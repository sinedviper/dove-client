import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IUser } from "interface";

export interface EditsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  edit: boolean;
  setEdit: Function;
  user: IUser | null;
}
