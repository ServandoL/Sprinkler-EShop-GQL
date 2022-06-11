import { Pagination } from "../../../interfaces/interfaces";

export interface ProductResponse {
  data: IProduct[];
  pagination: Pagination;
}

export interface ProductRequest {
  category: string;
  page: {
    pageNumber: number;
    pageSize: number;
  };
}

export interface IProduct {
  _id: String;
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
