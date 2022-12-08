import { IData } from "../Edit/Edits";
import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface EditsHeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setData: (data: IData) => void;
  initialData: IData;
  data: IData;
}
