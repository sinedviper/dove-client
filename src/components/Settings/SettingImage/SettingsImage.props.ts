import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SettingsImageProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setSettings?: (val: boolean) => void;
  profile: boolean;
  handleRemoveUser: (e: any) => void;
}
