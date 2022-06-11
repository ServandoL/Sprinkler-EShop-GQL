import { ApolloError } from 'apollo-server';
import { MongoServer } from '../../server/server';

export const Query = {
  cart: async (
    parent: any,
    { user_id }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.cartApi;
    try {
      await client.start();
      const result = await client.getCart(user_id);
      if (result) {
        return result;
      }
    } catch (error) {
      return error;
    } finally {
      await client.stop();
    }
  },
  products: async (
    parent: any,
    { productRequest }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.productsApi;
    try {
      await client.start();
      const result = await client.getProducts(productRequest);
      return result;
    } catch (err) {
      return err;
    } finally {
      await client.stop();
    }
  },
  allProducts: async (
    parent: any,
    { productRequest }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.productsApi;
    try {
      await client.start();
      const result = await client.getAllProducts(productRequest);
      return result;
    } catch (err) {
      return err;
    } finally {
      await client.stop();
    }
  },

  orders: async (
    parent: any,
    { email }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.ordersApi;
    try {
      await client.start();
      const result = await client.getOrders(email);
      if (result.length) {
        return result;
      } else {
        return new ApolloError(`You haven't placed any orders yet.`);
      }
    } catch (error) {
      return error;
    } finally {
      await client.stop();
    }
  },

  productById: async (
    parent: any,
    { _id }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client = dataSources.productsApi;
    try {
      await client.start();
      return await client.getOneById(_id);
    } catch (err) {
      return err;
    } finally {
      await client.stop();
    }
  },
  users: async (parent: any, args: any, { dataSources }: any, info: any) => {
    const client: MongoServer = dataSources.usersApi;
    try {
      await client.start();
      const result = await client.getUserByEmail(args.email, args.password);
      if (result === null) {
        return {
          message: 'No user with email or password was found.',
          success: false,
          user: null,
        };
      }
      if (result._id) {
        return {
          message: 'Successfully retrieved user.',
          success: true,
          user: result,
        };
      } else {
        return {
          message: 'Internal server error.',
          success: false,
          user: result,
        };
      }
    } catch (err) {
      return err;
    } finally {
      await client.stop();
    }
  },

  userById: async (
    parent: any,
    { _id }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client = dataSources.usersApi;
    try {
      await client.start();
      return await client.getOneById(_id);
    } catch (err) {
      return err;
    } finally {
      await client.stop();
    }
  },
};
