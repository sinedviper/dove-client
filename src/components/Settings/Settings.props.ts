import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IUserResponse } from "interface";

export interface SettingsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  settings: boolean;
  setSettings: Function;
  setEdit: Function;
  user: IUserResponse | null;
}
