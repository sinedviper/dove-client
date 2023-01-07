import { IChat, IUser } from "utils/interface";
export interface IMessage {
  id: number;
  text: string;
  senderMessage: IUser;
  chatId: IChat | number;
  read: boolean;
  reply: IMessage;
  createdAt: Date;
  updatedAt: Date;
  dateUpdate: Date;
}
