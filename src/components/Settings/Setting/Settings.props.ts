import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IUser } from "utils/interface";

export interface SettingsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setSettings?: (val: boolean) => void;
  sender?: IUser | undefined;
  profile?: boolean;
}
