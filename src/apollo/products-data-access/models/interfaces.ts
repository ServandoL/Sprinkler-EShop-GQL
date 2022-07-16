import { Pagination } from '../../../interfaces/interfaces';

export interface ProductResponse {
  data: IProduct[];
  pagination: Pagination;
}
export interface DeletedResponse {
  product: IProduct;
  isDeleted: boolean;
}
export interface DeleteRequest {
  product: IProduct;
  email: string;
}
export interface ProductRequest {
  category: string;
  page: {
    pageNumber: number;
    pageSize: number;
  };
}
export interface AddProductRequest {
  productName: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  imageUrl: string;
  createdBy: string;
}
export interface IProduct {
  _id: string;
  productName: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  imageUrl?: string;
  isDeleted?: boolean;
  deleted_by?: string;
  deleted_date?: string;
  addedDate?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedDate?: string;
  modified?: UpdateProductRequest[];
}

export interface UpdateProductRequest {
  productId: string;
  modifiedBy: string;
  modifiedDate: string;
  productName: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface FilterResponse {
  brands: string[];
  categories: string[];
  success: boolean;
}
