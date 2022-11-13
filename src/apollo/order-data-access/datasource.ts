import { DataSource } from 'apollo-datasource';
import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import {
  ClientSession,
  Collection,
  Db,
  Document,
  Filter,
  MongoClient,
  ObjectId,
  UpdateFilter,
} from 'mongodb';
import * as env from '../../../config';
import { Paginate } from '../../common/pagination';
import { Page } from '../../interfaces/interfaces';
import { Cart } from '../cart-data-access/models/interfaces';
import { IProduct } from '../products-data-access/models/interfaces';
import { CartItem, Order, OrderHistoryRequest } from './models/interfaces';

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
    const query: Filter<Order> = { userId: request.userId };
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
      throw new ApolloError(JSON.stringify(error));
    } else {
      return data;
    }
  }

  async createOrder(request: Order) {
    const productCollection: Collection<IProduct> = this.db.collection(env.newProducts);
    const transactionSession: ClientSession = this.client.startSession();
    console.log(this.loc + '.createOrder', `Request: ${JSON.stringify(request)}`);
    try {
      console.log(
        this.loc + '.createOrder',
        `Transaction started. ${JSON.stringify(new Date().toISOString())}`
      );
      const [error, data] = await to(
        transactionSession.withTransaction(async () => {
          for (const order of request.order) {
            const error = await this.validateQuantityOnHand(order, transactionSession);
            if (error !== true) {
              console.log(
                this.loc + '.saveCart',
                `Error validating quantities for ${JSON.stringify(order)}`
              );
              throw new ApolloError(error + ` Item: ${order.productName}`);
            }
          }
          for (const order of request.order) {
            const filter: Filter<IProduct> = { _id: new ObjectId(order._id) };
            const found = await productCollection.findOne(filter, { session: transactionSession });
            if (found?._id) {
              const update: UpdateFilter<IProduct> = {
                $set: {
                  stock: found.stock - order.quantity,
                },
              };
              await productCollection.updateOne(filter, update, { session: transactionSession });
            }
          }

          const doc: Order = {
            ...request,
            userId: request.userId.toString(),
            orderedDate: new Date().toISOString(),
            orderId: new ObjectId().toString(),
            order: [...request.order],
          };
          const [error, data] = await to(
            this.collection.insertOne(doc, { session: transactionSession })
          );
          if (error) {
            throw new ApolloError(
              `An error occurred while processing your order. Please try again. ${JSON.stringify(
                error
              )}`
            );
          } else {
            const filter: Filter<Cart> = { userId: request.userId };
            await this.db
              .collection(env.cartCollection)
              .deleteOne(filter, { session: transactionSession });
            return data;
          }
        })
      );
      if (error) {
        throw new ApolloError(
          `An error occurred while processing your order. Please try again. ${JSON.stringify(
            error
          )}`
        );
      } else {
        return data;
      }
    } catch (error) {
      throw new ApolloError(
        `An error occurred while processing your order. Please try again. ${JSON.stringify(error)}`
      );
    } finally {
      console.log(
        this.loc + '.createOrder',
        `Transaction ended. ${JSON.stringify(new Date().toISOString())}`
      );
      await transactionSession.endSession();
    }
  }

  async validateQuantityOnHand(request: CartItem, session: ClientSession) {
    try {
      const [error, data] = await to(
        this.db
          .collection<IProduct>(env.newProducts)
          .findOne({ _id: new ObjectId(request._id) }, { session })
      );

      if (error) {
        throw new ApolloError(`An error occurred while trying to validate quantities.`);
      } else {
        if (!data) {
          throw new ApolloError(`The product does not exists. ${JSON.stringify(request)}`);
        }
        if (request.quantity <= 0) {
          throw new ApolloError(`You cannot have a quantity of 0 or lower.`);
        }
        if (request.quantity > data.stock) {
          throw new ApolloError(`Quantity ordered is greater than the available on hand quantity.`);
        }
        return true;
      }
    } catch (error) {
      throw new ApolloError(
        `An error occurred while trying to validate quantities. ${JSON.stringify(error)}`
      );
    }
  }
}
