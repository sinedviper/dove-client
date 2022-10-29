export interface IMessage {
  id: number;
  text: string;
  senderMessage: number;
  chatId: number;
  createdAt: Date;
  updatedAt: Date;
}
