import { ApolloError } from 'apollo-server';
import { CartDatasource } from './datasource';
import { Order } from './models/interfaces';

export const Mutation = {
  createOrder: async (
    parent: any,
    args: {
      request: Order;
    },
    { dataSources }: any
  ) => {
    try {
      const cartApi: CartDatasource = dataSources.cartApi;
      const result = await cartApi.createOrder(args.request);
      if (!(result instanceof ApolloError)) {
        if (result?.acknowledged && result?.insertedId) {
          return {
            message: 'Successfully processed your order.',
            success: true,
          };
        }
        return {
          message: 'Could not process your order. Please try again later.',
          success: false,
        };
      } else {
        return result;
      }
    } catch (error) {
      return error;
    }
  },
};
