import { ApolloError } from 'apollo-server';
import mongoose, { ObjectId, SaveOptions } from 'mongoose';
import { IProduct, UpdateProductRequest } from './models/interfaces';
import { ProductSchema } from './models/products.schema';
import * as env from '../../config';
import { addNewProduct, softDeleteProduct, updateProduct } from './datasource';
const ProductModel: mongoose.Model<IProduct> = mongoose.model<IProduct>(
  env.productsCollection,
  ProductSchema
);

export const Mutation = {
  addProduct: async (
    parent: any,
    { addProductRequest }: any,
    { dataSources }: any,
    info: any
  ) => {
    try {
      const result = await ProductModel.create({
        ...addProductRequest,
        addedDate: new Date().toISOString(),
        _id: new mongoose.mongo.ObjectId(),
      });
      if (result._id) {
        return {
          message: 'Product added successfully.',
          success: true,
        };
      }
      return {
        message: 'An error occurred trying to add the product.',
        success: false,
      };
    } catch (err) {
      return err;
    }
  },
  deleteProduct: async (
    parent: any,
    { deleteRequest }: any,
    { dataSources }: any,
    info: any
  ) => {
    try {
      const result = await softDeleteProduct(deleteRequest);
      if (result) {
        if (result.isDeleted) {
          return {
            message: 'Product deleted successfully.',
            success: true,
          };
        }
        return {
          message: 'There was an error deleting this product.',
          success: false,
        };
      } else {
        return {
          message: 'Product does not exist.',
          success: false,
        };
      }
    } catch (err) {
      return err;
    }
  },
  updateProduct: async (
    parent: any,
    args: {
      updateRequest: UpdateProductRequest;
    }
  ) => {
    try {
      const result = await updateProduct(args.updateRequest);
      if (result && result._id) {
        return {
          message: 'Product updated successfully.',
          success: true,
        };
      } else {
        return new ApolloError(
          `The product coult not be updated. Please try again.`
        );
      }
    } catch (error) {
      return error;
    }
  },
};
