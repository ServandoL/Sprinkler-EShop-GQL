export interface IUser {
  _id: String;
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

export interface Pagination {
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  totalPages: number;
  offset: number;
  prevPage: number;
  nextPage: number;
  pagingCounter: number;
}

export interface Page {
  pageNumber: number;
  pageSize: number;
  sort?: string[];
}
