import { ApolloError } from "apollo-server-errors";
import { ICart, IProduct, IUser } from "../../interfaces/interfaces";

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
      await client.stop();
    }
  },
  addToCart: async (parent: any, args: ICart, { dataSources }: any, info: any) => {
    const client = dataSources.cartApi;
    const product = {
      productName: args.productName,
      price: args.price,
      category: args.category,
      brand: args.brand,
      stock: args.stock,
      imageUrl: args.imageUrl,
    };
    try {
      await client.start();
      console.log(args)
      if (args.user_id && product && args.quantity > 0) {
        if (args.quantity > product.stock) {
          return {
            message: 'Error: Quantity is greater than available amount.',
            success: false
          }
        } else {
          const result = await client.addToCart(args)
          if (result.acknowledged) {
            return {
              message: 'Added to cart successfully.',
              success: true
            }
          }
        }
      } else {
        return {
          message: 'Error: An error occurred while trying to add to the cart.',
          success: false
        }
      }
    } catch (error) {
      return new ApolloError(`An error occurred adding to the cart. ${error}`)
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
      await client.stop();
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
      await client.stop();
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
      await client.stop();
    }
  },
};
