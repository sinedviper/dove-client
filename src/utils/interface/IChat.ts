import { IUser, IMessage } from "utils/interface";
export interface IChat {
  id: number;
  user: IUser;
  lastMessage: IMessage;
}
