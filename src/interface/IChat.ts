export interface IChat {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  sender: number;
  recipient: number;
  senderChat: number;
  recipientChat: number;
}
