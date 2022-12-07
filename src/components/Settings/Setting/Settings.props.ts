import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IUser } from "utils/interface";

export interface SettingsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setSettings?: Function;
  sender?: IUser | undefined;
  profile?: boolean;
}
