import { IUser } from "interface";
export interface IMessage {
  id: number;
  text: string;
  senderMessage: IUser;
  chatId: number;
  createdAt: Date;
  updatedAt: Date;
}
