import { DataSource } from 'apollo-datasource';
import { Cart, CartItem, SaveCartRequest } from './models/interfaces';
import {
  MongoClient,
  Collection,
  Db,
  Filter,
  ObjectId,
  UpdateFilter,
  ClientSession,
} from 'mongodb';
import * as env from '../../../config';
import to from 'await-to-js';
import { ApolloError } from 'apollo-server';
import { IProduct } from '../products-data-access/models/interfaces';

export class CartDatasource extends DataSource {
  client!: MongoClient;
  collection!: Collection<Cart>;
  db!: Db;
  loc = 'CartDatasource';
  constructor(client: MongoClient) {
    super();
    this.client = client;
    this.db = this.client.db(env.database);
    this.collection = this.db.collection(env.cartCollection);
  }

  async getCart(userId: string) {
    const query: Filter<Cart> = { userId };
    try {
      const [error, data] = await to(this.collection.findOne(query));
      if (error) {
        return new ApolloError(
          `An error occurred while retrieving your cart. ${JSON.stringify(error)}`
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
    const transactionSession: ClientSession = this.client.startSession();
    console.log(this.loc+'.saveCart', `Request: ${JSON.stringify(request)}`)
    try {
      console.log(
        this.loc + '.saveCart',
        `Transaction started. ${JSON.stringify(new Date().toISOString())}`
      );
      const query: Filter<Cart> = { userId: request.userId };
      const [error, data] = await to(transactionSession.withTransaction(async () => {
        const [error, data] = await to(
          this.collection.findOne(query, { session: transactionSession })
        );
        if (error) {
          return new ApolloError(`
            An error occurred while trying to save to your cart.`);
        } else {
          if (!data) {
            for (const cartItem of request.cart) {
              const error = await this.validateQuantityOnHand(cartItem, transactionSession);
              if (error instanceof ApolloError) {
                console.log(
                  this.loc + '.saveCart',
                  `Error validating quantities for ${JSON.stringify(cartItem)}`
                );
                return new ApolloError(error + ` Item: ${cartItem.productName}`);
              }
            }
            const result = await this.collection.insertOne(
              {
                userId: request.userId,
                cart: request.cart,
                _id: new ObjectId().toString(),
                createdDate: new Date().toISOString(),
              },
              { session: transactionSession }
            );
            if (result.acknowledged && result.insertedId) {
              return true;
            }
            return false;
          } else {
            const toUpdate: CartItem[] = request.cart;
            for (const product of toUpdate) {
              const error = await this.validateQuantityOnHand(product, transactionSession);
              if (error instanceof ApolloError) {
                return error;
              }
            }
            const update: UpdateFilter<Cart> = {
              $set: {
                ...data,
                cart: toUpdate,
              },
            };
            const result = await this.collection.findOneAndUpdate(query, update, {
              session: transactionSession,
            });
            if (result && result.ok) {
              return true;
            }
            return false;
          }
        }
      }))
      if (error) {
        return new ApolloError(`ERROR: ${JSON.stringify(error)}`)
      } else {
        return data;
      }
      
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to save to your cart. ${JSON.stringify(error)}`
      );
    } finally {
      console.log(
        this.loc + '.saveCart',
        `Transaction ended. ${JSON.stringify(new Date().toISOString())}`
      );
      await transactionSession.endSession();
    }
  }

  async clearCart(userId: string) {
    try {
      const query: Filter<Cart> = { userId };
      const result = await this.collection.deleteOne(query);
      if (result.acknowledged && result.deletedCount) {
        return true;
      }
      return false;
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to delete your cart. ${JSON.stringify(error)}`
      );
    }
  }

  async updateCartQuantity(request: CartItem) {
    const session: ClientSession = this.client.startSession();
    try {
      console.log(
        this.loc + '.updateCartQuantity',
        `Transaction started. ${JSON.stringify(new Date().toISOString())}`
      );
      const [error, data] = await to(
        session.withTransaction(async () => {
          const query: Filter<Cart> = { userId: request.userId };
          const validateQuantity = await this.validateQuantityOnHand(request, session);
          if (validateQuantity instanceof ApolloError) {
            return validateQuantity;
          }
          const [error, data] = await to(this.collection.findOne(query, { session }));
          if (error) {
            return new ApolloError(
              `An error occurred while trying to update your cart. ${JSON.stringify(error)}`
            );
          } else {
            const cartItems: CartItem[] = data?.cart || [];
            const toUpdate: CartItem | undefined = cartItems.find(
              (product) => product._id === request._id
            );
            const updatedCart: CartItem[] = cartItems.map((product) =>
              product._id === toUpdate?._id ? toUpdate : product
            );
            const cartQuery: Filter<Cart> = { userId: request.userId };
            const update: UpdateFilter<Cart> = {
              $set: {
                cart: updatedCart,
                updated: true,
              },
            };
            return await this.collection.findOneAndUpdate(cartQuery, update, { session });
          }
        })
      );
      if (error) {
        return new ApolloError(`ERROR: ${JSON.stringify(error)}`);
      } else {
        return data;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to update your cart. ${JSON.stringify(error)}`
      );
    } finally {
      console.log(
        this.loc + '.updateCartQuantity',
        `Transaction ended. ${JSON.stringify(new Date().toISOString())}`
      );
      await session.endSession();
    }
  }

  async addToCart(request: CartItem) {
    const session: ClientSession = this.client.startSession();
    try {
      console.log(
        this.loc + '.addToCart',
        `Transaction start. ${JSON.stringify(new Date().toISOString())}`
      );
      const [error, data] = await to(
        session.withTransaction(async () => {
          const validateQuantity = await this.validateQuantityOnHand(request, session);
          if (validateQuantity instanceof ApolloError) {
            return validateQuantity;
          }
          const query: Filter<Cart> = { userId: request.userId };
          const [error, data] = await to(this.collection.findOne(query));
          if (error) {
            return new ApolloError(
              `An error ocurred while trying to add to your cart. ${JSON.stringify(error)}`
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
            const query: Filter<Cart> = { userId: request.userId };
            const update: UpdateFilter<Cart> = {
              $set: {
                cart: cartItems,
                updated: true,
              },
            };
            return await this.collection.findOneAndUpdate(query, update);
          }
        })
      );
      if (error) {
        return new ApolloError(`ERROR: ${JSON.stringify(error)}`);
      } else {
        return data;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to add to your cart. ${JSON.stringify(error)}`
      );
    } finally {
      console.log(
        this.loc + '.addToCart',
        `Transaction ended. ${JSON.stringify(new Date().toISOString())}`
      );
      await session.endSession();
    }
  }

  async validateQuantityOnHand(request: CartItem, session: ClientSession) {
    try {
      const query: Filter<IProduct> = { _id: request._id };
      const [error, data] = await to(
        this.db.collection<IProduct>(env.productsCollection).findOne(query, { session })
      );
      if (error) {
        return new ApolloError(`An error occurred while trying to validate quantities.`);
      } else {
        if (!data) {
          return new ApolloError(`The product does not exists. ${JSON.stringify(request)}`);
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
        `An error occurred while trying to validate quantities. ${JSON.stringify(error)}`
      );
    }
  }
}
