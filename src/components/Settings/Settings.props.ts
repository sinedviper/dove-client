import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IUser } from "interface";

export interface SettingsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  settings: boolean;
  setSettings: Function;
  setEdit?: Function;
  profile?: boolean;
  user: IUser | null | undefined;
}
