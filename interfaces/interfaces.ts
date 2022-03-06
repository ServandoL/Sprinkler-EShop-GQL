import { ObjectId } from 'mongodb';

export interface IProduct {
  _id: String | ObjectId;
  productName: String;
  price: Number;
  category: String;
  brand: String;
  stock: Number;
  imageUrl?: String;
  isDeleted?: Boolean;
  deleted_by?: String;
  deleted_date?: String;
}

export interface IUser {
  _id: String | ObjectId;
  fname: String;
  lname: String;
  email: String;
  password: Boolean;
  isAdmin: Boolean;
}

export interface ICart {
  user_id: string;
  productName: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  imageUrl: string;
  quantity: number;
}
