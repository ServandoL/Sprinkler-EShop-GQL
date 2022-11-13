import { CartDatasource } from './datasource';

export const Query = {
  getCart: async (parent: any, args: { userId: string }, { dataSources }: any) => {
    try {
      const client: CartDatasource = dataSources.cartApi;
      const result = await client.getCart(args.userId);
      if (result) {
        return {
          cart: result.cart,
          userId: result.userId,
        };
      } else {
        return {
          cart: [],
          userId: args.userId,
        };
      }
    } catch (error) {
      return error;
    }
  },
};
