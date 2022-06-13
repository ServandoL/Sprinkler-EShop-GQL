export interface ICart {
  _id: string;
  email?: string;
  productName: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  imageUrl: string;
  quantity: number;
}

export interface SaveCartRequest {
  _id: string;
  cart: ICart[];
  email: string;
  createdDate?: string;
  updated?: boolean;
}
