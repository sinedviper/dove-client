import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IUserResponse } from "interface";

export interface EditsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  edit: boolean;
  setEdit: Function;
  user: IUserResponse | null;
}
