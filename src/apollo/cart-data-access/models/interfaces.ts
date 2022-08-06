export interface CartItem {
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

export interface Cart {
  _id: string;
  cart: CartItem[];
  email: string;
  createdDate?: string;
  updated?: boolean;
  dateProcessed?: string;
  processedInd?: boolean;
}

export interface SaveCartRequest {
  email: string;
  cart: CartItem[];
}

export interface UpdateQuantityRequest {
  _id: string;
  email: string;
  quantity: number;
}
