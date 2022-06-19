import { Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import * as env from '../../../config';
import { IProduct } from './interfaces';
const productColn = env.productsCollection;

export const ProductSchema = new Schema<IProduct>(
  {
    _id: String,
    productName: String,
    price: Number,
    category: String,
    brand: String,
    stock: Number,
    imageUrl: String,
    isDeleted: Boolean,
    deleted_by: String,
    deleted_date: String,
    addedDate: String,
    createdBy: String,
    lastModifiedDate: String,
    createdDate: String,
    modified: [
      {
        productId: String,
        modifiedBy: String,
        modifiedDate: String,
        productName: String,
        price: Number,
        stock: Number,
        imageUrl: String,
      },
    ],
  },
  {
    collection: productColn,
  }
);

ProductSchema.plugin(paginate);
