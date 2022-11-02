import { IUser, IMessage } from "interface";
export interface IChat {
  id: number;
  user: IUser;
  lastMessage: IMessage;
}
