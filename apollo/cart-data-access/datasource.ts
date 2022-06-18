import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';
import { IProduct } from '../products-data-access/models/interfaces';
import { ICart, SaveCartRequest } from './models/interfaces';
import * as env from '../../config';
import { ProductSchema } from '../products-data-access/models/products.schema';
import { CartSchema } from './models/cart.schema';
const CartModel: mongoose.Model<SaveCartRequest> =
  mongoose.model<SaveCartRequest>(env.cartCollection, CartSchema);
const ProductModel: mongoose.Model<IProduct> = mongoose.model<IProduct>(
  env.productsCollection,
  ProductSchema
);
export async function getCart(email: string) {
  const query: FilterQuery<SaveCartRequest> = { email: email };
  const [error, data] = await to(CartModel.find(query).exec());
  if (error) {
    return new ApolloError(
      `An error occurred while retrieving your cart. ${JSON.stringify(error)}`
    );
  } else {
    return {
      content: data,
      type: 'SaveCartRequest',
    };
  }
}

export async function saveCart(email: string, cart: ICart[]) {
  try {
    let exists!: boolean;
    const query: FilterQuery<SaveCartRequest> = { email: email };
    const [error, data] = await to(CartModel.find(query).exec());
    if (error) {
      return new ApolloError(`An error occurred trying to save your cart.`);
    } else {
      if (data && data.length) {
        exists = true;
      } else {
        exists = false;
      }
    }
    if (!exists) {
      const result = await CartModel.create({
        email: email,
        cart: [...cart],
        createdDate: new Date().toISOString(),
        _id: new mongoose.mongo.ObjectId(),
      });
      return result;
    }
    return undefined;
  } catch (error) {
    return new ApolloError(
      `An error occurred while trying to save your cart. ${JSON.stringify(
        error
      )}`
    );
  }
}

export async function clearCart(email: string) {
  try {
    const query: FilterQuery<SaveCartRequest> = {
      email: email,
    };
    return await CartModel.findOneAndRemove(query, { projection: { _id: 1 } });
  } catch (error) {
    return new ApolloError(
      `An error ocurred while trying to delete your cart. Pleast try again. ${JSON.stringify(
        { error: error }
      )}`
    );
  }
}

export async function updateCartQuantity(request: ICart) {
  const query: FilterQuery<SaveCartRequest> = { email: request.email };
  const [error, data] = await to(CartModel.find(query).exec());
  if (error) {
    return new ApolloError(
      `An error occurred while trying to add to your cart. ${JSON.stringify(
        error
      )}`
    );
  }
  const cart = data ? [...data[0].cart] : [];
  const exists: any = cart.filter((product) => product._id === request._id);
  let product: ICart = exists[0];
  product.quantity = request.quantity;
  const productQuery: FilterQuery<IProduct> = {
    _id: product._id,
  };
  const result = await ProductModel.findOne(productQuery).exec();
  if (result) {
    if (result?.stock < product.quantity) {
      return new ApolloError(
        `ERROR: Quantity ordered is greater than quantity available.`
      );
    }
  }
  const updatedCart: ICart[] = cart.map((item: ICart) =>
    item._id === product._id ? product : item
  );

  const cartQuery: FilterQuery<SaveCartRequest> = {
    email: request.email,
  };
  const update: UpdateQuery<SaveCartRequest> = {
    cart: [...updatedCart],
    updated: true,
  };
  const updatedResult = CartModel.findOneAndUpdate(cartQuery, update, {
    returnDocument: 'after',
  });
  return updatedResult;
}

export async function addToCart(request: ICart) {
  try {
    const query: FilterQuery<SaveCartRequest> = { email: request.email };
    const [error, data] = await to(CartModel.find(query).exec());
    if (error) {
      return new ApolloError(
        `An error occurred while trying to add to your cart. ${JSON.stringify(
          error
        )}`
      );
    } else {
      const cart = data ? [...data[0].cart] : [];
      const exists: any = cart.filter((product) => product._id === request._id);
      if (exists.length) {
        return await updateCartQuantity(request);
      } else {
        const updatedCart = [...cart];
        updatedCart.push(request);
        const query: FilterQuery<SaveCartRequest> = {
          email: request.email,
        };
        const update: UpdateQuery<SaveCartRequest> = {
          cart: [...updatedCart],
          updated: true,
        };
        const result = CartModel.findOneAndUpdate(query, update, {
          returnDocument: 'after',
        });
        return result;
      }
    }
  } catch (error) {
    return new ApolloError(
      `An error occurred while trying to add to your cart. ${JSON.stringify(
        error
      )}`
    );
  }
}
