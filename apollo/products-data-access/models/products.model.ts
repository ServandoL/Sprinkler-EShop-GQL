import mongoose, { Document, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { IProduct } from "../../../interfaces/interfaces";
import * as env from "../../../config";
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
  },
  {
    collection: productColn,
  }
);

ProductSchema.plugin(paginate);
