export interface CartItem {
  _id: string;
  userId?: string;
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
  userId: string;
  createdDate?: string;
  updated?: boolean;
  dateProcessed?: string;
  processedInd?: boolean;
}

export interface SaveCartRequest {
  userId: string;
  cart: CartItem[];
}

export interface UpdateQuantityRequest {
  _id: string;
  email: string;
  quantity: number;
}
