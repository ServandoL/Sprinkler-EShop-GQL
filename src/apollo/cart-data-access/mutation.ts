import { ApolloError } from 'apollo-server';
import { CartDatasource } from './datasource';
import { CartItem, SaveCartRequest } from './models/interfaces';

export const Mutation = {
  saveCart: async (
    parent: any,
    args: {
      request: SaveCartRequest;
    },
    { dataSources }: any
  ) => {
    try {
      const client: CartDatasource = dataSources.cartApi;
      const result = await client.saveCart(args.request);
      if (result instanceof ApolloError) {
        return result;
      }
      if (result) {
        return {
          message: 'Your cart was saved successfully.',
          success: true,
        };
      }
      return new ApolloError(
        `An error occurred while trying to save your cart. You can only have one cart saved at any time.`
      );
    } catch (error) {
      return error;
    }
  },
  addToCart: async (
    parent: any,
    args: {
      request: CartItem;
    },
    { dataSources }: any
  ) => {
    try {
      const client: CartDatasource = dataSources.cartApi;
      const result = await client.addToCart(args.request);
      if (result instanceof ApolloError) {
        return result;
      } else {
        if (result.ok) {
          return {
            message: 'Successfully updated your cart.',
            success: true,
          };
        }
        return new ApolloError(`There was an error while trying to update your cart.`);
      }
    } catch (error) {
      return error;
    }
  },
  clearCart: async (
    parent: any,
    args: {
      email: string;
    },
    { dataSources }: any
  ) => {
    try {
      const client: CartDatasource = dataSources.cartApi;
      const result = await client.clearCart(args.email);
      if (result instanceof ApolloError) {
        return result;
      }
      if (result) {
        return {
          message: 'Successfully cleared your cart.',
          success: true,
        };
      }
      return new ApolloError(`No items in your cart to delete.`);
    } catch (error) {
      return error;
    }
  },
  updateCart: async (
    parent: any,
    args: {
      request: CartItem;
    },
    { dataSources }: any
  ) => {
    try {
      const client: CartDatasource = dataSources.cartApi;
      const result = await client.updateCartQuantity(args.request);
      if (result instanceof ApolloError) {
        return result;
      }
      if (result.ok) {
        return {
          message: 'Successfully updated your cart.',
          success: true,
        };
      } else {
        return new ApolloError(`An error occurred while trying to update your cart. Please try again.`);
      }
    } catch (error) {
      return error;
    }
  },
};
