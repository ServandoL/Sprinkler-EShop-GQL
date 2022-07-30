import { ApolloError } from 'apollo-server';
import { OrderDatasource } from './datasource';
import { OrderHistoryRequest } from './models/interfaces';

export const Query = {
  orders: async (
    parent: any,
    args: { orderHistoryRequest: OrderHistoryRequest },
    { dataSources }: any
  ) => {
    try {
      const orderApi = dataSources.orderApi as OrderDatasource;
      const result = await orderApi.getOrders(args.orderHistoryRequest);
      return result;
    } catch (error) {
      return error;
    }
  },
};
