import { DataSource } from "apollo-datasource";
import { Cart, CartItem, SaveCartRequest } from "./models/interfaces";
import {
  MongoClient,
  Collection,
  Db,
  Filter,
  ObjectId,
  UpdateFilter,
} from "mongodb";
import * as env from "../../../config";
import to from "await-to-js";
import { ApolloError } from "apollo-server";
import { IProduct } from "../products-data-access/models/interfaces";

export class CartDatasource extends DataSource {
  client!: MongoClient;
  collection!: Collection<Cart>;
  db!: Db;
  loc = "CartDatasource";
  constructor(client: MongoClient) {
    super();
    this.client = client;
    this.db = this.client.db(env.database);
    this.collection = this.db.collection(env.cartCollection);
  }

  async getCart(email: string) {
    const query: Filter<Cart> = { email: email };
    try {
      const [error, data] = await to(this.collection.findOne(query));
      if (error) {
        return new ApolloError(
          `An error occurred while retrieving your cart. ${JSON.stringify(
            error
          )}`
        );
      } else {
        return data;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while retrieving your cart. ${JSON.stringify(error)}`
      );
    }
  }

  async saveCart(request: SaveCartRequest) {
    try {
      const query: Filter<Cart> = { email: request.email };
      const [error, data] = await to(this.collection.findOne(query));
      if (error) {
        return new ApolloError(`
            An error occurred while trying to save to your cart.`);
      } else {
        if (!data) {
          const result = await this.collection.insertOne({
            email: request.email,
            cart: request.cart,
            _id: new ObjectId().toString(),
            createdDate: new Date().toISOString(),
          });
          if (result.acknowledged && result.insertedId) {
            return true;
          }
          return false;
        } else {
          const toUpdate: CartItem[] = request.cart;
          for (const product of toUpdate) {
            const error = await this.validateQuantityOnHand(product);
            if (error instanceof ApolloError) {
              return error
            }
          }
          const update: UpdateFilter<Cart> = {
            $set: {
              ...data,
              cart: toUpdate
            }
          }
          const result = await this.collection.findOneAndUpdate(query, update);
          if (result && result.ok) {
            return true
          }
          return false;
        }
        return false;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to save to your cart. ${JSON.stringify(
          error
        )}`
      );
    }
  }

  async clearCart(email: string) {
    try {
      const query: Filter<Cart> = { email: email };
      const result = await this.collection.deleteOne(query);
      if (result.acknowledged && result.deletedCount) {
        return true;
      }
      return false;
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to delete your cart. ${JSON.stringify(
          error
        )}`
      );
    }
  }

  async updateCartQuantity(request: CartItem) {
    const query: Filter<Cart> = { email: request.email };
    const validateQuantity = await this.validateQuantityOnHand(request);
    if (validateQuantity instanceof ApolloError) {
      return validateQuantity;
    }
    const [error, data] = await to(this.collection.findOne(query));
    if (error) {
      return new ApolloError(
        `An error occurred while trying to update your cart. ${JSON.stringify(
          error
        )}`
      );
    } else {
      const cartItems: CartItem[] = data?.cart || [];
      const toUpdate: CartItem | undefined = cartItems.find(
        (product) => product._id === request._id
      );
      const updatedCart: CartItem[] = cartItems.map((product) =>
        product._id === toUpdate?._id ? toUpdate : product
      );
      const cartQuery: Filter<Cart> = { email: request.email };
      const update: UpdateFilter<Cart> = {
        $set: {
          cart: updatedCart,
          updated: true,
        },
      };
      return await this.collection.findOneAndUpdate(cartQuery, update);
    }
  }

  async addToCart(request: CartItem) {
    try {
      const validateQuantity = await this.validateQuantityOnHand(request);
      if (validateQuantity instanceof ApolloError) {
        return validateQuantity;
      }
      const query: Filter<Cart> = { email: request.email };
      const [error, data] = await to(this.collection.findOne(query));
      if (error) {
        return new ApolloError(
          `An error ocurred while trying to add to your cart. ${JSON.stringify(
            error
          )}`
        );
      } else {
        const cartItems: CartItem[] = data?.cart || [];
        const exists: CartItem | undefined = cartItems.find(
          (product) => product._id === request._id
        );
        if (!!exists) {
          return await this.updateCartQuantity(exists);
        }
        cartItems.push(request);
        const query: Filter<Cart> = { email: request.email };
        const update: UpdateFilter<Cart> = {
          $set: {
            cart: cartItems,
            updated: true,
          },
        };
        return await this.collection.findOneAndUpdate(query, update);
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to add to your cart. ${JSON.stringify(
          error
        )}`
      );
    }
  }

  async validateQuantityOnHand(request: CartItem) {
    try {
      const query: Filter<IProduct> = { _id: request._id };
      const [error, data] = await to(
        this.db.collection<IProduct>(env.productsCollection).findOne(query)
      );
      if (error) {
        return new ApolloError(
          `An error occurred while trying to validate quantities.`
        );
      } else {
        if (!data) {
          return new ApolloError(
            `The product does not exists. ${JSON.stringify(request)}`
          );
        }
        if (request.quantity <= 0) {
          return new ApolloError(`You cannot have a quantity of 0 or lower.`);
        }
        if (request.quantity > data.stock) {
          return new ApolloError(
            `Quantity ordered is greater than the available on hand quantity.`
          );
        }
        return true;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to validate quantities. ${JSON.stringify(
          error
        )}`
      );
    }
  }
}
