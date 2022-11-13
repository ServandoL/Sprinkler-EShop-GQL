import { ObjectId } from 'mongodb';

export interface IUser {
  _id: ObjectId;
  fname: string;
  lname: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdDate?: string;
  updatedDate?: string;
  updated?: boolean;
  deleted?: boolean;
}

export interface UpdateRequest {
  _id: ObjectId;
  currentPassword: string;
  email?: string;
  newPassword?: string;
}
