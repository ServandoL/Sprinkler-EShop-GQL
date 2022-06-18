import { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { Order } from './interfaces';
import * as env from '../../../config';

export const OrderSchema = new Schema<Order>(
  {
    _id: String,
    order: [
      {
        _id: String,
        productName: String,
        price: Number,
        category: String,
        brand: String,
        stock: Number,
        imageUrl: String,
        quantity: Number,
      },
    ],
    shipping: {
      address: String,
      address2: String,
      city: String,
      state: String,
      zipCode: String,
    },
    payment: {
      cardNumber: String,
      month: String,
      year: String,
      cvv: String,
    },
    email: String,
    orderedDate: String,
    total: Number,
    orderId: String,
  },
  {
    collection: env.ordersCollection,
  }
);

OrderSchema.plugin(paginate);
