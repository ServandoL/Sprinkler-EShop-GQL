import { GraphQLError } from 'graphql';
import { CartDatasource } from './datasource';
import { CartItem, SaveCartRequest } from './models/interfaces';
import { AppContext } from '../../interfaces/interfaces';

export const Mutation = {
  saveCart: async (
    parent: any,
    args: {
      request: SaveCartRequest;
    },
    { dataSources }: AppContext
  ) => {
    try {
      const client: CartDatasource = dataSources.cartApi;
      const result = await client.saveCart(args.request);
      if (result instanceof GraphQLError) {
        return result;
      }
      if (result) {
        return {
          message: 'Your cart was saved successfully.',
          success: true,
        };
      }
      throw new GraphQLError(
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
      if (result instanceof GraphQLError) {
        return result;
      } else {
        if (result) {
          return {
            message: 'Successfully updated your cart.',
            success: true,
          };
        }
        throw new GraphQLError(`There was an error while trying to update your cart.`);
      }
    } catch (error) {
      return error;
    }
  },
  clearCart: async (
    parent: any,
    args: {
      userId: string;
    },
    { dataSources }: any
  ) => {
    try {
      const client: CartDatasource = dataSources.cartApi;
      const result = await client.clearCart(args.userId);
      if (result) {
        return {
          message: 'Successfully cleared your cart.',
          success: true,
        };
      }
      throw new GraphQLError(`No items in your cart to delete.`);
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
      if (result instanceof GraphQLError) {
        return result;
      }
      if (result) {
        return {
          message: 'Successfully updated your cart.',
          success: true,
        };
      } else {
        throw new GraphQLError(
          `An error occurred while trying to update your cart. Please try again.`
        );
      }
    } catch (error) {
      return error;
    }
  },
};
