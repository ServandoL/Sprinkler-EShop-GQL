import { ApolloError } from 'apollo-server';
import { ProductDatasource } from './datasource';
import {
  AddProductRequest,
  DeleteRequest,
  ReviewRequest,
  UpdateProductRequest,
} from './models/interfaces';

export const Mutation = {
  addProduct: async (
    parent: any,
    args: {
      addProductRequest: AddProductRequest;
    },
    { dataSources }: any,
    info: any
  ) => {
    try {
      const client: ProductDatasource = dataSources.productApi;
      const result = await client.createProduct(args.addProductRequest);
      if (result instanceof ApolloError) {
        return result;
      }
      if (result?.acknowledged && result?.insertedId) {
        return {
          message: 'Product added successfully.',
          success: true,
        };
      }
      return {
        message: 'An error occurred trying to add the product.',
        success: false,
      };
    } catch (error) {
      return error;
    }
  },
  deleteProduct: async (
    parent: any,
    args: {
      deleteRequest: DeleteRequest;
    },
    { dataSources }: any,
    info: any
  ) => {
    try {
      const client: ProductDatasource = dataSources.productApi;
      const result = await client.softDeleteProduct(args.deleteRequest);
      if (result instanceof ApolloError) {
        return result;
      }
      if (result && result.ok) {
        return {
          message: 'Product deleted successfully.',
          success: true,
        };
      }
      return {
        message: 'There was an error deleting this product.',
        success: false,
      };
    } catch (error) {
      return error;
    }
  },
  updateProduct: async (
    parent: any,
    args: {
      updateRequest: UpdateProductRequest;
    },
    { dataSources }: any
  ) => {
    try {
      const client: ProductDatasource = dataSources.productApi;
      const result = await client.updateProduct(args.updateRequest);
      if (result instanceof ApolloError) {
        return result;
      }
      if (!!result && result.ok) {
        return {
          message: 'Product updated successfully.',
          success: true,
        };
      }
      return new ApolloError(`The product could not be updated. Please try again.`);
    } catch (error) {
      return error;
    }
  },
  reviewProduct: async (
    parent: any,
    args: {
      reviewRequest: ReviewRequest;
    },
    { dataSources }: any
  ) => {
    try {
      const client: ProductDatasource = dataSources.productApi;
      const result = await client.reviewProduct(args.reviewRequest);
      if (result instanceof ApolloError) {
        return result;
      }
      if (!!result && result.ok) {
        return {
          message: 'Product reviewed successfully.',
          success: true,
        };
      }
      return new ApolloError(`The product could not be reviewed. Please try again.`);
    } catch (error) {
      return error;
    }
  },
};
