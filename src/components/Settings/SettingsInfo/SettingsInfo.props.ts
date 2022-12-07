import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IImage, IUser } from "utils/interface";

export interface SettingsInfoProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  imageUser: IImage[] | undefined;
  user: IUser | undefined;
  handleRemovePhoto: Function;
  profile: boolean;
  handleLoadPhoto: (e: any) => void;
  handleCopy: Function;
}
