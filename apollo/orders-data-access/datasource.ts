import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';
import { Order } from './models/interfaces';
import * as env from '../../config';
import { OrderSchema } from './models/orders.schema';
import { IProduct } from '../products-data-access/models/interfaces';
import { ProductSchema } from '../products-data-access/models/products.schema';
const OrderModel: mongoose.Model<Order> = mongoose.model<Order>(
  env.ordersCollection,
  OrderSchema
);
const ProductModel: mongoose.Model<IProduct> = mongoose.model<IProduct>(
  env.productsCollection,
  ProductSchema
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
  for (const order of request.order) {
    const found = await ProductModel.findOne({ _id: order._id }).exec();
    if (found?._id) {
      const query: FilterQuery<IProduct> = { _id: order._id };
      const update: UpdateQuery<IProduct> = {
        stock: found.stock - order.quantity,
      };
      const result = await ProductModel.updateOne(query, update).exec();
      console.log(result);
    } else {
      return new ApolloError(
        `Oops! This product is no longer available. ${JSON.stringify({
          order,
        })}`
      );
    }
  }
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
