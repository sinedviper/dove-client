import { IChat, IUser } from "utils/interface";
export interface IMessage {
  id: number;
  text: string;
  senderMessage: IUser;
  chatId: IChat;
  read: boolean;
  reply: IMessage;
  createdAt: Date;
  updatedAt: Date;
}
