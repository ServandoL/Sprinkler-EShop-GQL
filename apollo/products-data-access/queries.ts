import mongoose, { PaginateModel } from 'mongoose';
import { getAllProducts, getProducts } from './datasource';
import { IProduct } from './models/interfaces';
import * as env from '../../config';
import { ProductSchema } from './models/products.schema';
const ProductModel: PaginateModel<IProduct> = mongoose.model<
  IProduct,
  PaginateModel<IProduct>
>(env.productsCollection, ProductSchema);

export const Query = {
  products: async (
    parent: any,
    { productRequest }: any,
    { dataSources }: any,
    info: any
  ) => {
    try {
      const result = await getProducts(productRequest, ProductModel);
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
      const result = await getAllProducts(productRequest, ProductModel);
      return result;
    } catch (err) {
      return err;
    }
  },
};
