import { ApolloError } from 'apollo-server';
import { OrderDatasource } from './datasource';
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
      const orderApi: OrderDatasource = dataSources.orderApi;
      const result = await orderApi.createOrder(args.request);
      if (!(result instanceof ApolloError)) {
        if (!!result) {
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
