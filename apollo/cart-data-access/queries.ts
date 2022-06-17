import { ICart } from './models/interfaces';
import { getCart } from './datasource';

export const Query = {
  getCart: async (parent: any, { email }: any) => {
    try {
      const result = await getCart(email);

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
