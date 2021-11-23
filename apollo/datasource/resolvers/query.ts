import to from "await-to-js";

export const Query = {
  products: async (parent: any, args: any, { dataSources }: any, info: any) => {
    const client = dataSources.productsApi;
    try {
      await client.start();
      return await client.getAll(args);
    } catch (err) {
      console.error("Error getting all products", err);
      return {
        code: `ERROR`,
        message: `Error occured getting data.\n${err}`
      };
    } finally {
      client.stop();
    }
  },
  users: async (parent: any, args: any, { dataSources }: any, info: any) => {
    const client = dataSources.usersApi;
    try {
      await client.start();
      return await client.getAll(args);
    } catch (err) {
      console.error("Error getting all users", err);
      return {
        code: `ERROR`,
        message: `Error occured getting data.\n${err}`
      };
    } finally {
      client.stop();
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
    } catch(err) {
      console.error(`Error getting product with id: ${_id}.\n${err}`);
      return {
        code: `ERROR`,
        message: `Error occured getting product with id: ${_id}\n${err}`
      };
    } finally {
      client.stop();
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
      console.error(`Error getting user with id: ${_id}.\n${err}`);
      return {
        code: `ERROR`,
        message: `Error occured getting user with id: ${_id}\n${err}`
      };
    } finally {
      client.stop();
    }
  },
};
