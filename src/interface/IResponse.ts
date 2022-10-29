import { IMessage } from "./IMessage";
import { IChat } from "./IChat";
import { IUser } from "./IUser";
import { IContact } from "./IContact";

export interface IUserResponse {
  status: string;
  data: IUser | IUser[];
  message: string;
}
export interface IChatResponse {
  status: string;
  data: IChat | IChat[];
  message: string;
}
export interface IMessageResponse {
  status: string;
  data: IMessage | IMessage[];
  message: string;
}
export interface IContactResponse {
  status: string;
  data: IContact | IContact[];
  message: string;
}

export interface ILoginResponse {
  status: string;
  access_token: string;
  message: string;
}
