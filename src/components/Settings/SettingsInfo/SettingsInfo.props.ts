import { DetailedHTMLProps, HTMLAttributes } from "react";

import { IImage, IUser } from "utils/interface";

export interface SettingsInfoProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  imageUser: IImage[] | undefined;
  user: IUser | undefined;
  handleRemovePhoto: (id: number, file: string) => void;
  profile: boolean;
  handleLoadPhoto: (e: any) => void;
  handleCopy: (val: string) => void;
}
