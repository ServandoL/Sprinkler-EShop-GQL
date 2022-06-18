import { ApolloError } from 'apollo-server';
import { createOrder } from './datasource';
import { Order } from './models/interfaces';

export const Mutation = {
  createOrder: async (
    parent: any,
    args: {
      request: Order;
    }
  ) => {
    try {
      const result = await createOrder(args.request);
      if (result && result._id) {
        return {
          message: 'Successfully processed your order.',
          success: true,
        };
      } else {
        return new ApolloError(
          `An error occurred while processing your request. Please try again.`
        );
      }
    } catch (error) {
      return error;
    }
  },
};
