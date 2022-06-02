import { ApolloError } from 'apollo-server';
import { InsertOneResult, UpdateResult } from 'mongodb';
import {
  ICart,
  IProduct,
  IUser,
  SaveCartRequest,
} from '../../interfaces/interfaces';
import { MongoServer } from '../../server/server';

export const Mutation = {
  updateCartQuantity: async (
    parent: any,
    args: ICart,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.cartApi;
    try {
      await client.start();
      if (args.quantity < 1) {
        return {
          message: 'Quantity cannot be less than 1.',
          success: false,
        };
      } else {
        const result: any = await client.updateCartQuantity(args);
        if (result?.modifiedCount === 1) {
          return {
            message: 'Successfully updated your cart.',
            success: true,
          };
        } else {
          return {
            message: result,
            success: false,
          };
        }
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while updating your cart. ${error}`
      );
    } finally {
      client.stop();
    }
  },
  clearCart: async (
    parent: any,
    { user_id }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.cartApi;
    try {
      await client.start();
      const result: any = await client.clearCart(user_id);
      if (result?.deletedCount === 1) {
        return {
          message: 'Successfully deleted your cart.',
          success: true,
        };
      } else {
        return {
          message:
            'There was an error trying to delete your cart. Please try again.',
          success: false,
        };
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to delete your cart. ${error}`
      );
    } finally {
      await client.stop();
    }
  },
  saveCart: async (
    parent: any,
    { cart }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.cartApi;
    try {
      await client.start();
      const result = (await client.saveCart(cart)) as UpdateResult;
      console.log('result', result);
      if (result?.upsertedId || result.modifiedCount) {
        return {
          message: 'Successfully saved your cart.',
          success: true,
        };
      } else {
        return {
          message: 'Could not save your cart.',
          success: false,
        };
      }
    } catch (error: unknown) {
      return new ApolloError(
        `An error occured trying to save your cart. ${JSON.stringify({
          error: error,
        })}`
      );
    } finally {
      await client.stop();
    }
  },
  addToCart: async (
    parent: any,
    args: ICart,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.cartApi;
    try {
      await client.start();
      if (args.user_id && args.quantity > 0) {
        if (args.quantity > args.stock) {
          return {
            message: 'Error: Quantity is greater than available amount.',
            success: false,
            product: { ...args },
          };
        } else {
          const result: any = await client.addToCart(args);
          if (result.acknowledged) {
            return {
              message: 'Added to cart successfully.',
              success: true,
              product: { ...args },
            };
          }
        }
      } else {
        return {
          message: 'Error: An error occurred while trying to add to the cart.',
          success: false,
        };
      }
    } catch (error) {
      return new ApolloError(`An error occurred adding to the cart. ${error}`);
    } finally {
      await client.stop();
    }
  },
  addProduct: async (
    parent: any,
    args: IProduct,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.productsApi;
    try {
      await client.start();
      if (
        args.productName &&
        args.price &&
        args.category &&
        args.brand &&
        args.stock
      ) {
        const result: any = await client.addOne(args);
        if (result.acknowledged) {
          return {
            message: 'Product added successfully.',
            success: true,
            product: { ...args },
          };
        }
        return {
          message: 'An error occurred trying to add the product.',
          success: false,
          product: { ...args },
        };
      } else {
        return new ApolloError('All fields must be filled in.');
      }
    } catch (err) {
      return new ApolloError('Unable to add product.');
    } finally {
      await client.stop();
    }
  },
  deleteProduct: async (
    parent: any,
    { _id }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.productsApi;
    try {
      await client.start();
      const result: any = await client.softDeleteOne(_id);
      if (result.modifiedCount > 0) {
        return {
          message: 'Product deleted successfully.',
          success: true,
        };
      }
      return {
        message: 'There was an error deleting this product.',
        success: false,
      };
    } catch (err) {
      return new ApolloError(`Error trying delete ID: ${_id}.\n${err}`);
    } finally {
      await client.stop();
    }
  },
  addUser: async (
    parent: any,
    args: IUser,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.usersApi;
    try {
      await client.start();
      if (args.fname && args.lname && args.email && args.isAdmin !== null) {
        const result: any = await client.addOne(args);
        if (result.acknowledged) {
          return {
            message: 'User added successfully.',
            success: true,
            user: { ...args },
          };
        }
        return {
          message: 'An error occurred trying to add the user.',
          details: result,
          success: false,
          user: { ...args },
        };
      } else {
        return new ApolloError('All fields must be filled in.');
      }
    } catch (err) {
      return new ApolloError('Unable to add user.');
    } finally {
      await client.stop();
    }
  },
  deleteUser: async (
    parent: any,
    { email }: any,
    { dataSources }: any,
    info: any
  ) => {
    const client: MongoServer = dataSources.usersApi;
    try {
      await client.start();
      const result: any = await client.deleteOne(email);
      if (result.deletedCount > 0) {
        console.log('MYCONSOLE', result);
        return {
          message: 'User deleted successfully.',
          success: true,
        };
      }
      return {
        message: 'There was an error deleting the user.',
        success: false,
      };
    } catch (err) {
      return new ApolloError(`Error trying to delete user: ${email}.\n${err}`);
    } finally {
      await client.stop();
    }
  },
};
