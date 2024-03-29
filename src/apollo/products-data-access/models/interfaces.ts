import { Document, ObjectId, WithId } from 'mongodb';
import { Pagination } from '../../../interfaces/interfaces';

export interface FindProductRequest {
  brand: string[];
  categories: string[];
  priceRange: number[];
  search: string;
  rating: number;
  page: {
    pageNumber: number;
    pageSize: number;
  };
}

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
export interface IProduct extends WithId<Document> {
  productName: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  rating?: number;
  ratings?: Rating[];
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

export interface UpdateProductRequest extends WithId<Document> {
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

export interface Rating {
  name: string;
  review: string;
  rate: number;
  createdDate: string;
  headLine: string;
}

export interface ReviewRequest {
  productId: ObjectId;
  name: string;
  review: string;
  headLine: string;
  rate: number;
  createdDate: string;
}

export interface CurrentProduct {
  product: IProduct;
}
