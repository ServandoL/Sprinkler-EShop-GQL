import { DataSource } from 'apollo-datasource';
import _ from 'lodash';
import {
  Collection,
  Document,
  InsertOneResult,
  MongoClient,
  ObjectId,
  UpdateResult,
} from 'mongodb';
import { ICart, SaveCartRequest } from '../interfaces/interfaces';

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
      return err;
    }
  }

  async saveCart(request: SaveCartRequest): Promise<UpdateResult> {
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
      return error;
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
      return error;
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
      return error;
    }
  }

  async clearCart(email: string) {
    try {
      return await this.database.deleteOne({
        email: email,
      });
    } catch (error) {
      console.log(error);
      return error;
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
      console.log(`Error occurred trying to delete: ${err}`);
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
      console.log(`Error occurred while updating: ${err}`);
    }
  }
}
