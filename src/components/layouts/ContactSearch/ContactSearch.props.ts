import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IUser } from "utils/interface";

export interface ContactSearchProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  handleFocus: (cotanct: IUser) => void;
  contact: IUser;
  windowSize: number;
  username: string;
}
