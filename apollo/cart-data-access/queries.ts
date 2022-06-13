import mongoose from 'mongoose';
import { ICart, SaveCartRequest } from './models/interfaces';
import * as env from '../../config';
import { CartSchema } from './models/cart.schema';
import { getCart } from './datasource';
const CartModel: mongoose.Model<SaveCartRequest> =
  mongoose.model<SaveCartRequest>(env.cartCollection, CartSchema);

export const Query = {
  getCart: async (parent: any, { email }: any) => {
    try {
      const result = await getCart(email, CartModel);

      if (result?.type === 'SaveCartRequest') {
        return {
          cart: [...result.content[0].cart] as ICart[],
          email: email,
        };
      } else {
        return {
          cart: [],
          email: email,
        };
      }
    } catch (error) {
      return error;
    }
  },
};

//    getCart(email: String): getCartResponse
/**
 *   type getCartResponse {
    cart: [Cart]
    email: String
  }
 */
