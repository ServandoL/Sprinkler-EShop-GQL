import { ICart } from './models/interfaces';
import {
  saveCart,
  addToCart,
  clearCart,
  updateCartQuantity,
} from './datasource';
import { ApolloError } from 'apollo-server';

export const Mutation = {
  saveCart: async (
    parent: any,
    args: {
      request: {
        email: string;
        cart: ICart[];
      };
    }
  ) => {
    try {
      const result = await saveCart(args.request.email, args.request.cart);
      if (result && result._id) {
        return {
          message: 'Your cart was saved successfully.',
          success: true,
        };
      } else {
        return new ApolloError(
          `An error occurred while trying to save your cart. You can only save one cart at a time.`
        );
      }
    } catch (error) {
      return error;
    }
  },
  addToCart: async (parent: any, { request }: any) => {
    try {
      if (request.email && request.quantity > 0) {
        if (request.quantity > request.stock) {
          return {
            message: `ERROR: Quantity ordered is greater than available on hand.`,
            success: false,
          };
        } else {
          const result = await addToCart(request);
          if (result) {
            if (result.updated) {
              return {
                message: 'Successfully updated your cart.',
                success: true,
              };
            } else {
              return new ApolloError('There was an error updating your cart.');
            }
          } else {
            return new ApolloError(
              'An error occurred trying to add to your cart. Pleast try agian.'
            );
          }
        }
      } else {
        return new ApolloError(
          `An error occurred while trying to add to your cart. Please try again.`
        );
      }
    } catch (error) {
      return error;
    }
  },
  clearCart: async (parent: any, { email }: any) => {
    try {
      const result = await clearCart(email);
      if (result) {
        if (result._id) {
          return {
            message: 'Successfully cleared your cart.',
            success: true,
          };
        }
      } else {
        return {
          message: 'No items in your cart to delete.',
          success: false,
        };
      }
    } catch (error) {
      return error;
    }
  },
  updateCart: async (parent: any, { request }: any) => {
    try {
      if (request.quantity < 1) {
        return {
          message: 'ERROR: Quantity ordered cannot be less than 1.',
          success: false,
        };
      } else {
        const result = await updateCartQuantity(request);
        if (result) {
          if (result.updated) {
            return {
              message: 'Successfully updated your cart.',
              success: true,
            };
          } else {
            return new ApolloError(
              `An error ocurred while trying to update your cart. Please try again`
            );
          }
        }
      }
    } catch (error) {
      return error;
    }
  },
};

/*
    saveCart(request: SaveCartRequest): genericResponse
    addToCart(request: AddToCartInput): genericResponse
    clearCart(email: String): genericResponse
    updateCart(request: UpdateCartQuantity): genericResponse
*/
