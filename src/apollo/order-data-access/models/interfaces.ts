import { Document, ObjectId, WithId } from 'mongodb';
import { Pagination } from '../../../interfaces/interfaces';

export interface Order {
  _id: ObjectId;
  userId: string;
  order: CartItem[];
  shipping: Shipping;
  payment: CreditCard;
  email: string;
  orderedDate: string;
  total: number;
  orderId: string;
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

export interface CartItem {
  _id: ObjectId;
  productName: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  imageUrl: string;
  quantity: number;
}

export interface OrderHistoryRequest {
  userId: string;
  page: {
    pageSize: number;
    pageNumber: number;
  };
}

export interface OrderHistoryResponse {
  data: Order[];
  pagination: Pagination;
}

export interface SPCOrders extends WithId<Document> {
  brand: string;
  price: number;
  category: string;
  imageUrl: string | undefined;
  isDeleted: boolean;
  dateOrdered: Date;
  productName: string;
  orderedQuantity: number;
}
