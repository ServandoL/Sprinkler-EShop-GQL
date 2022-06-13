import { ICart } from '../../cart-data-access/models/interfaces';

export interface Order {
  order: ICart[];
  shipping: Shipping;
  payment: CreditCard;
  email: string;
  orderedDate: Date;
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
