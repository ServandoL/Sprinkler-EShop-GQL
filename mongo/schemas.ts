import { Schema } from 'mongoose';

export const ProductSchema = new Schema({
    _id: String,
    productName: String,
    price: Number,
    category: String,
    brand: String,
    stock: Number,
    imageUrl: String,
    isDeleted: Boolean,
    deleted_by: String,
    deleted_date: String
});

