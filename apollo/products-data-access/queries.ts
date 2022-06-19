import { getAllProducts, getProducts } from './datasource';

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
};
