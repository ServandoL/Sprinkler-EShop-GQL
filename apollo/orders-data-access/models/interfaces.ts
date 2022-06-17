export interface Order {
  _id: string;
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
  _id: string;
  productName: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  imageUrl: string;
  quantity: number;
}
