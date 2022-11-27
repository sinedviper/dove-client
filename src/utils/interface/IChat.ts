import { IUser, IMessage, IImage } from "utils/interface";
export interface IChat {
  id: number;
  user: IUser;
  lastMessage: IMessage;
  image: IImage;
}
