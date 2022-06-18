import { ApolloError } from 'apollo-server';
import { getOrders } from './datasource';

export const Query = {
  orders: async (parent: any, { orderHistoryRequest }: any) => {
    try {
      const result = await getOrders(orderHistoryRequest);
      return result;
    } catch (error) {
      return error;
    }
  },
};
