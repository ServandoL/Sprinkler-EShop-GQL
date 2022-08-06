import { DataSource } from 'apollo-datasource';
import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import { Collection, Db, Document, Filter, MongoClient, ObjectId, UpdateFilter, UpdateOneModel } from 'mongodb';
import * as env from '../../../config';
import { Paginate } from '../../common/pagination';
import { Page } from '../../interfaces/interfaces';
import { IProduct } from '../products-data-access/models/interfaces';
import { Order, OrderHistoryRequest } from './models/interfaces';

export class OrderDatasource extends DataSource {
  client!: MongoClient;
  collection!: Collection<Order>;
  db!: Db;
  loc = 'OrderDatasource';
  constructor(client: MongoClient) {
    super();
    this.client = client;
    this.db = this.client.db(env.database);
    this.collection = this.db.collection(env.ordersCollection);
  }

  async getOrders(request: OrderHistoryRequest) {
    const query: Filter<Order> = { email: request.email };
    const pageOptions: Page = {
      pageNumber: request.page.pageNumber,
      pageSize: request.page.pageSize,
    };
    const aggregate: Document[] = [
      {
        $match: {
          ...query,
        },
      },
    ];
    console.log(`${this.loc}.getOrders`, `aggregate: ${JSON.stringify(aggregate)}`);
    const [error, data] = await to(Paginate(this.collection, aggregate, pageOptions));
    if (error) {
      return new ApolloError(JSON.stringify(error));
    } else {
      return data;
    }
  }

  async createOrder(request: Order) {
    const productCollection: Collection<IProduct> = this.db.collection(env.productsCollection);
    for (const order of request.order) {
      const filter: Filter<IProduct> = { _id: order._id };
      const found = await productCollection.findOne(filter);
      if (found?._id) {
        if (found.stock < order.quantity) {
          return new ApolloError(
            `Oh snap! You can't order more than the available quantity.\n Please adjust your quantity for ${order.productName}`
          );
        }
      } else {
        return new ApolloError(
          `Oops! This product is no longer available. ${JSON.stringify({
            order,
          })}`
        );
      }
    }
    for (const order of request.order) {
      const filter: Filter<IProduct> = { _id: order._id.toString() };
      const found = await productCollection.findOne(filter);
      if (found?._id) {
        const update: UpdateFilter<IProduct> = {
          $set: {
            stock: found.stock - order.quantity,
          },
        };
        await productCollection.updateOne(filter, update);
      }
    }
    const doc: Order = {
      ...request,
      orderedDate: new Date().toISOString(),
      orderId: new ObjectId().toString(),
      order: [...request.order],
    };
    const [error, data] = await to(this.collection.insertOne(doc));
    if (error) {
      return new ApolloError(
        `An error occurred while processing your order. Please try again. ${JSON.stringify(error)}`
      );
    } else {
      return data;
    }
  }
}
