export interface IUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt?: Date;
  name: string;
  surname: string;
}
