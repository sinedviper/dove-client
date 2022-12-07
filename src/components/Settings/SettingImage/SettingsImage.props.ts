import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface SettingsImageProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setSettings: Function | undefined;
  profile: boolean;
  handleRemoveUser: (e: any) => void;
}
