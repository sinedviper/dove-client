import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IUser } from "utils/interface";

export interface SettingsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
  setSettings?: Function;
  sender?: IUser | undefined;
  profile?: boolean;
}
