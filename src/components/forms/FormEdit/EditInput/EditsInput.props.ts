import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IData } from "../Edit/Edits";

export interface EditsInputProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  edit: boolean;
  data: IData;
  setData: (data: IData) => void;
  initialData: IData;
}
