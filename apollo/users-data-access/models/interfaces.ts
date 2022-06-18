export interface IUser {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  password: boolean;
  isAdmin: boolean;
  createdDate?: string;
  updatedDate?: string;
  updated?: boolean;
}

export interface UpdateRequest {
  email?: String;
  fname?: String;
  lname?: String;
  password?: String;
}
