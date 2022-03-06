import { DataSource } from 'apollo-datasource';
import _ from 'lodash';
import {
  Collection,
  Document,
  MongoClient,
  ObjectId,
  UpdateResult,
} from 'mongodb';
import { ICart } from '../interfaces/interfaces';

export class MongoServer extends DataSource {
  uri = `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.faqfr.mongodb.net/${process.env.mongoDatabase}`;
  client = new MongoClient(this.uri, { monitorCommands: true });
  dbName = process.env.mongoDatabase;
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
      return await this.database.find({ user_id: user_id }).toArray();
    } catch (err) {
      return err;
    }
  }

  async addToCart(product: ICart): Promise<UpdateResult | Document | unknown> {
    try {
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

  async removeFromCart(product: ICart) {
    try {
      return await this.database.deleteOne({
        user_id: product.user_id,
        productName: product.productName,
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
