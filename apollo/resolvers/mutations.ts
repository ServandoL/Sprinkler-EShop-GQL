import { ApolloError } from "apollo-server-errors";
import { IProduct, IUser } from "../../interfaces/interfaces";

export const Mutation = {
  addProduct: async (
    parent: any,
    args: IProduct,
    { dataSources }: any,
    info: any
  ) => {
    const client = dataSources.productsApi;
    try {
      await client.start();
      if (
        args.productName &&
        args.price &&
        args.category &&
        args.brand &&
        args.stock
      ) {
        const result = await client.addOne(args);
        if (result.acknowledged) {
          return {
            message: 'Product added successfully.',
            success: true,
            product: {...args}
          }
        }
        return {
          message: 'An error occurred trying to add the product.',
          success: false,
          product: {...args}
        }
      } else {
        return new ApolloError("All fields must be filled in.");
      }
    } catch (err) {
      return new ApolloError("Unable to add product.");
    } finally {
      client.stop();
    }
  },
  addUser: async (
    parent: any,
    args: IUser,
    { dataSources }: any,
    info: any
  ) => {
    const client = dataSources.usersApi;
    try {
      await client.start();
      if (args.fname && args.lname && args.email && args.isAdmin !== null) {
        const result = await client.addOne(args);
        if (result.acknowledged) {
          return {
            message: 'User added successfully.',
            success: true,
            user: {...args}
          }
        }
        return {
          message: 'An error occurred trying to add the user.',
          details: result,
          success: false,
          user: {...args}
        }
      } else {
        return new ApolloError("All fields must be filled in.");
      }
    } catch (err) {
      return new ApolloError("Unable to add user.");
    } finally {
      client.stop();
    }
  },
  deleteProduct: async (
    parent: any,
    { _id }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client = dataSources.productsApi;
    try {
      await client.start();
      const result = await client.softDeleteOne(_id);
      if (result.modifiedCount > 0) {
        return {
          message: 'Product deleted successfully.',
          success: true
        }
      }
      return {
        message: 'There was an error deleting this product.',
        success: false
      }
    } catch (err) {
      return new ApolloError(`Error trying delete ID: ${_id}.\n${err}`);
    } finally {
      client.stop();
    }
  },
  deleteUser: async (
    parent: any,
    { email }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client = dataSources.usersApi;
    try {
      await client.start();
      const result = await client.deleteOne(email);
      if (result.deletedCount > 0) {
        console.log('MYCONSOLE',result);
        return {
          message: 'User deleted successfully.',
          success: true,
        }
      }
      return {
        message: 'There was an error deleting the user.',
        success: false
      }
    } catch (err) {
      return new ApolloError(`Error trying to delete user: ${email}.\n${err}`);
    } finally {
      client.stop();
    }
  },
};
