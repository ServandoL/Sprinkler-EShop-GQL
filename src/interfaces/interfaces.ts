import { Document } from 'mongodb';
import { OrderDatasource } from '../apollo/order-data-access/datasource';
import { ProductDatasource } from '../apollo/products-data-access/datasource';
import { CartDatasource } from '../apollo/cart-data-access/datasource';
import { UserDatasource } from '../apollo/users-data-access/datasource';

export interface AppContext {
  dataSources: {
    orderApi: OrderDatasource;
    productApi: ProductDatasource;
    cartApi: CartDatasource;
    userApi: UserDatasource;
  };
}

export interface Pagination {
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  totalPages: number;
  offset: number;
  prevPage: number | null;
  nextPage: number | null;
}

export interface Page {
  pageNumber: number;
  pageSize: number;
  sort?: string[];
}

export interface PaginatedResponse {
  data: Document[];
  pagination: Pagination;
}
