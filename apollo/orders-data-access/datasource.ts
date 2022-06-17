import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import mongoose, { FilterQuery } from 'mongoose';
import { Order } from './models/interfaces';
import * as env from '../../config';
import { OrderSchema } from './models/orders.schema';
const OrderModel: mongoose.Model<Order> = mongoose.model<Order>(
  env.ordersCollection,
  OrderSchema
);

export async function getOrders(email: string) {
  const query: FilterQuery<Order> = { email: email };
  const [error, data] = await to(OrderModel.find(query).exec());
  if (error) {
    return new ApolloError(
      `An error occurred while retrieving your orders. Please try again later. ${JSON.stringify(
        error
      )}`
    );
  } else {
    return data;
  }
}

export async function createOrder(request: Order) {
  const [error, data] = await to(
    OrderModel.create({
      ...request,
      _id: new mongoose.Types.ObjectId(),
      orderedDate: new Date().toISOString(),
      orderId: new mongoose.Types.ObjectId(),
      order: [...request.order],
    })
  );
  if (error) {
    return new ApolloError(
      `An error ocurred while processing your request. Please try again. ${JSON.stringify(
        error
      )}`
    );
  } else {
    return data;
  }
}
