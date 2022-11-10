import { IChat, IUser } from "interface";
export interface IMessage {
  id: number;
  text: string;
  senderMessage: IUser;
  chatId: IChat;
  createdAt: Date;
  updatedAt: Date;
}
