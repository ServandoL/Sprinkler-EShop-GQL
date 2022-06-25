export interface IUser {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdDate?: string;
  updatedDate?: string;
  updated?: boolean;
}

export interface UpdateRequest {
  _id: string;
  email?: string;
  newPassword?: string;
}
