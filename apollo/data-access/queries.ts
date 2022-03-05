import { ApolloError } from 'apollo-server';

export const Query = {
  cart: async (
    parent: any,
    { user_id }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client = dataSources.cartApi;
    try {
      await client.start();
      return await client.getCart(user_id);
    } catch (error) {
      return new ApolloError(`Error getting cart information.\n${error}`);
    } finally {
      await client.stop();
    }
  },
  products: async (parent: any, args: any, { dataSources }: any, info: any) => {
    const client = dataSources.productsApi;
    try {
      await client.start();
      return await client.getAll(args);
    } catch (err) {
      return new ApolloError(`Error getting all products.\n${err}`);
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
      return new ApolloError(`Error getting product with ID: ${_id}.\n${err}`);
    } finally {
      await client.stop();
    }
  },
  users: async (parent: any, args: any, { dataSources }: any, info: any) => {
    const client = dataSources.usersApi;
    try {
      await client.start();
      return await client.getAll(args);
    } catch (err) {
      return new ApolloError(`Error getting all users.\n${err}`);
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
      return new ApolloError(`Error getting user with ID: ${_id}.\n${err}`);
    } finally {
      await client.stop();
    }
  },
};
