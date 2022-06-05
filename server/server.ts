import { DataSource } from 'apollo-datasource';
import { ApolloError } from 'apollo-server';
import _ from 'lodash';
import {
  Collection,
  Document,
  InsertOneResult,
  MongoClient,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';
import {
  ICart,
  IProduct,
  Order,
  SaveCartRequest,
} from '../interfaces/interfaces';

export class MongoServer extends DataSource {
  uri = process.env.connectionString || '';
  client = new MongoClient(this.uri, { monitorCommands: true });
  dbName = process.env.mongoDatabase || '';
  collection!: any;
  database!: Collection<Document>;

  constructor(collectionName: string | undefined) {
    super();
    this.collection = collectionName;
  }

  async start() {
    await this.client.connect();
    this.database = this.client.db(this.dbName).collection(this.collection);
    console.log(`Connected successfully to MongoDB: ${this.dbName}`);
    this.client.on('commandStarted', (event) => console.debug(event));
    this.client.on('commandSucceeded', (event) => console.debug(event));
    this.client.on('commandFailed', (event) => console.debug(event));
  }

  async stop() {
    await this.client.close();
  }

  async getAll(args: any) {
    const data = await this.database.find({}).toArray();
    return _.filter(data, args);
  }

  async getCart(user_id: string) {
    try {
      return await this.database.findOne({ email: user_id });
    } catch (err) {
      return new ApolloError(
        `An error occurred while retrieving your cart. ${JSON.stringify({
          error: err,
        })}`
      );
    }
  }

  async getOrders(email: string) {
    try {
      return await this.database.find({ email: email }).toArray();
    } catch (error) {
      return new ApolloError(
        `An error occurred while retrieving your orders. ${JSON.stringify({
          error: error,
        })}`
      );
    }
  }

  async saveCart(request: SaveCartRequest): Promise<UpdateResult | any> {
    try {
      return await this.database.updateOne(
        { email: request.user_id },
        {
          $set: {
            cart: [...request.cart],
            email: request.user_id,
            createdDate: new Date(),
          },
        },
        {
          upsert: true,
        }
      );
    } catch (error: any) {
      return new ApolloError(
        `An error occured trying to save your cart. ${JSON.stringify({
          error: error,
        })}`
      );
    }
  }

  async addToCart(product: ICart): Promise<UpdateResult | Document | unknown> {
    try {
      const existingProduct = await this.database.findOne({
        user_id: product.user_id,
        productName: product.productName,
      });
      if (existingProduct) {
        return await this.updateCartQuantity(product);
      }
      return this.database.insertOne(product);
    } catch (error) {
      return new ApolloError(
        `An error occured trying update your cart. ${JSON.stringify({
          error: error,
        })}`
      );
    }
  }

  async updateCartQuantity(product: ICart) {
    try {
      const document = await this.database.findOne({
        user_id: product.user_id,
        productName: product.productName,
      });
      if (product.quantity > document?.stock) {
        return 'Error: Quantity cannot be greater than available stock amount.';
      } else {
        return await this.database.updateOne(
          {
            user_id: product.user_id,
            productName: product.productName,
          },
          {
            $set: {
              quantity: product.quantity,
            },
          }
        );
      }
    } catch (error) {
      return new ApolloError(
        `An error occured trying to update your cart. ${JSON.stringify({
          error: error,
        })}`
      );
    }
  }

  async checkout(order: Order, productClient: MongoServer) {
    try {
      for (const product of order.order) {
        console.log('product', product);
        const found: WithId<Document> | null =
          await productClient.database.findOne({
            productName: product.productName,
          });
        if (found !== null) {
          console.log('found', found);
          await productClient.database.updateOne(
            { _id: found._id },
            {
              $set: {
                stock: found.stock - product.quantity,
              },
            }
          );
        } else {
          return new ApolloError(`Ooops! This product does not exist.`);
        }
      }
      return await this.database.insertOne({
        ...order,
      });
    } catch (error: any) {
      return new ApolloError(
        `An error occured while processing your order. ${JSON.stringify({
          error: error,
        })}`
      );
    }
  }

  async clearCart(email: string) {
    try {
      return await this.database.deleteOne({
        email: email,
      });
    } catch (error) {
      console.log(error);
      return new ApolloError(
        `An error occured trying clear your cart. ${JSON.stringify({
          error: error,
        })}`
      );
    }
  }

  async getOneById(id: any) {
    try {
      const query = { _id: id };
      return await this.database.findOne(query);
    } catch (err) {
      return err;
    }
  }

  async addOne(obj: any) {
    let duplicateExists = null;
    try {
      if (obj.fname && obj.lname && obj.email && obj.password) {
        duplicateExists = await this.database.findOne({ email: obj.email });
        if (!duplicateExists) {
          return await this.database.insertOne(obj);
        }
        return 'User already exists.';
      }
    } catch (err) {
      console.log(`Error occured while inserting: ${err}`);
    }
  }

  async deleteOne(email: string) {
    try {
      const query = { email: email };
      return await this.database.deleteOne(query);
    } catch (err) {
      return new ApolloError(
        `An error occured deleting this item. ${JSON.stringify({
          error: err,
        })}`
      );
    }
  }

  async softDeleteOne(id: any) {
    try {
      const query = { _id: id };
      const deletion = {
        $set: {
          isDeleted: true,
        },
      };
      return await this.database.updateOne(query, deletion);
    } catch (err) {
      return new ApolloError(
        `An error occured deleting this item. ${JSON.stringify({
          error: err,
        })}`
      );
    }
  }
}
