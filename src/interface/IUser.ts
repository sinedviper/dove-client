export interface IUser {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  bio: string;
  theme: boolean;
  animation: boolean;
  online: Date;
  password?: string;
  createdAt: Date;
  updatedAt?: Date;
}
