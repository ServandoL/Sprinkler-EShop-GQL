import { ApolloError } from "apollo-server";
import { CartDatasource } from "./datasource";

export const Query = {
  getCart: async (
    parent: any,
    args: { email: string },
    { dataSources }: any
  ) => {
    try {
      const client: CartDatasource = dataSources.cartApi;
      const result = await client.getCart(args.email);
      if (result instanceof ApolloError) {
        return result;
      }
      if (!!result) {
        return {
          cart: result.cart,
          email: result.email,
        };
      } else {
        return {
          cart: [],
          email: args.email,
        };
      }
    } catch (error) {
      return error;
    }
  },
};
