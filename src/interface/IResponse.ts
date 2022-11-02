import { IMessage } from "./IMessage";
import { IChat } from "./IChat";
import { IUser } from "./IUser";

export interface IUserResponse {
  status: string;
  data: IUser;
  message: string;
}
export interface IChatResponse {
  status: string;
  data: IChat[];
  message: string;
}
export interface IMessageResponse {
  status: string;
  data: IMessage[];
  message: string;
}
export interface IContactResponse {
  status: string;
  data: IUser[];
  message: string;
}

export interface ILoginResponse {
  status: string;
  access_token: string;
  message: string;
}
