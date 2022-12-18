import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MessageHeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setSettings: (Val: boolean) => void;
  settings: boolean;
}
