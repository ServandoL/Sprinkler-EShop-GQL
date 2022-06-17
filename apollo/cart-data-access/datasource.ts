import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';
import { IProduct } from '../products-data-access/models/interfaces';
import { ICart, SaveCartRequest } from './models/interfaces';

export async function getCart(
  email: string,
  model: mongoose.Model<SaveCartRequest>
) {
  const query: FilterQuery<SaveCartRequest> = { email: email };
  const [error, data] = await to(model.find(query).exec());
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

export async function saveCart(
  request: SaveCartRequest,
  model: mongoose.Model<SaveCartRequest>
) {
  try {
    const result = await model.create({
      ...request,
      createdDate: new Date().toISOString(),
      _id: new mongoose.mongo.ObjectId(),
    });
    return result;
  } catch (error) {
    return new ApolloError(
      `An error occurred while trying to save your cart. ${JSON.stringify(
        error
      )}`
    );
  }
}

export async function clearCart(
  email: string,
  model: mongoose.Model<SaveCartRequest>
) {
  try {
    const query: FilterQuery<SaveCartRequest> = {
      email: email,
    };
    return await model.findOneAndRemove(query, { projection: { _id: 1 } });
  } catch (error) {
    return new ApolloError(
      `An error ocurred while trying to delete your cart. Pleast try again. ${JSON.stringify(
        { error: error }
      )}`
    );
  }
}

export async function updateCartQuantity(
  request: ICart,
  CartModel: mongoose.Model<SaveCartRequest>,
  ProductModel: mongoose.Model<IProduct>
) {
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

export async function addToCart(
  request: ICart,
  CartModel: mongoose.Model<SaveCartRequest>,
  ProductModel: mongoose.Model<IProduct>
) {
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
        return await updateCartQuantity(request, CartModel, ProductModel);
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
