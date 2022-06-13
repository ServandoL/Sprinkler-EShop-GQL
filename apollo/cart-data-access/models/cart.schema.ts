import { Schema } from 'mongoose';
import { ICart, SaveCartRequest } from './interfaces';
import * as env from '../../../config';
import paginate from 'mongoose-paginate-v2';

export const CartSchema = new Schema<SaveCartRequest>(
  {
    _id: String,
    cart: [
      {
        _id: String,
        email: String,
        productName: String,
        price: Number,
        category: String,
        brand: String,
        stock: Number,
        imageUrl: String,
        quantity: Number,
      },
    ],
    email: String,
    createdDate: String,
    updated: Boolean,
  },
  {
    collection: env.cartCollection,
  }
);

CartSchema.plugin(paginate);
