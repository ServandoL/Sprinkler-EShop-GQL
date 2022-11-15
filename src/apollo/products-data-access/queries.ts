import { ProductDatasource } from './datasource';
import { ProductRequest } from './models/interfaces';

export const Query = {
  getCurrentProduct: async (
    parent: any,
    args: {
      productId: string;
    },
    { dataSources }: any
  ) => {
    try {
      const client: ProductDatasource = dataSources.productApi;
      return await client.getCurrentProduct(args.productId);
    } catch (error) {
      return error;
    }
  },
  products: async (
    parent: any,
    args: {
      productRequest: ProductRequest;
    },
    { dataSources }: any
  ) => {
    try {
      const client: ProductDatasource = dataSources.productApi;
      return await client.getProducts(args.productRequest);
    } catch (error) {
      return error;
    }
  },
  allProducts: async (
    parent: any,
    args: {
      productRequest: ProductRequest;
    },
    { dataSources }: any
  ) => {
    try {
      const client: ProductDatasource = dataSources.productApi;
      return await client.getAllProducts(args.productRequest);
    } catch (error) {
      return error;
    }
  },
  getFilters: async (
    parent: any,
    args: {
      filterRequest: {
        filters: string[];
      };
    },
    { dataSources }: any
  ) => {
    try {
      const client: ProductDatasource = dataSources.productApi;
      return await client.getProductFilters(args.filterRequest.filters);
    } catch (error) {
      return error;
    }
  },
};
