import { getAllProducts, getProductFilters, getProducts } from './datasource';
import { FilterResponse } from './models/interfaces';

export const Query = {
  products: async (
    parent: any,
    { productRequest }: any,
    { dataSources }: any,
    info: any
  ) => {
    try {
      const result = await getProducts(productRequest);
      return result;
    } catch (err) {
      return err;
    }
  },
  allProducts: async (
    parent: any,
    { productRequest }: any,
    { dataSources }: any,
    info: any
  ) => {
    try {
      const result = await getAllProducts(productRequest);
      return result;
    } catch (err) {
      return err;
    }
  },
  getFilters: async (
    parent: any,
    args: {
      filterRequest: {
        filters: string[];
      };
    }
  ) => {
    try {
      const result = await getProductFilters(args.filterRequest.filters);
      return result;
    } catch (error) {
      return error;
    }
  },
};
