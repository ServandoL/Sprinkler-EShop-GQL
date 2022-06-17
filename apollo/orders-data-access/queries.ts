import { ApolloError } from 'apollo-server';
import { getOrders } from './datasource';

export const Query = {
  orders: async (
    parent: any,
    args: {
      email: string;
    }
  ) => {
    try {
      const result = await getOrders(args.email);
      if (result) {
        if (result.length > 0) {
          return {
            orders: result,
            message: 'Successfully retrieved your order history.',
            success: true,
          };
        } else {
          return {
            orders: result,
            message: "You haven't placed any orders.",
            success: false,
          };
        }
      } else {
        return new ApolloError(
          `An error occurred while retrieving your orders. Please try again.`
        );
      }
    } catch (error) {
      return error;
    }
  },
};
