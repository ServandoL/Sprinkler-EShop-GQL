import { Document, ObjectId } from 'mongodb';

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

export interface SaveCartRequest {
  cart: ICart[];
  user_id: string;
}

export interface Shipping {
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CreditCard {
  cardNumber: string;
  month: string;
  year: string;
  cvv: string;
}

export interface Order {
  order: ICart[];
  shipping: Shipping;
  payment: CreditCard;
  email: string;
  orderedDate: Date;
  total: number;
  orderId: string;
}

export interface PaginatedResponse {
  data: Document[];
  pagination: Pagination;
}
export interface Pagination {
  pageSize: number;
  pageNumber: number;
  firstPage: boolean;
  lastPage: boolean;
  currentPage: number;
  totalElements: number;
  totalPages: number;
}
export interface ProductRequest {
  category: string;
  page: {
    pageNumber: number;
    pageSize: number;
  };
}
