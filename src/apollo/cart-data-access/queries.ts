import { ApolloError } from 'apollo-server';
import { CartDatasource } from './datasource';
import { OrderHistoryRequest } from './models/interfaces';

export const Query = {
  orders: async (
    parent: any,
    args: { orderHistoryRequest: OrderHistoryRequest },
    { dataSources }: any
  ) => {
    try {
      const cartApi = dataSources.cartApi as CartDatasource;
      const result = await cartApi.getOrders(args.orderHistoryRequest);
      return result;
    } catch (error) {
      return error;
    }
  },
};
