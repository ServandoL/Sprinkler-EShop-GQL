import { Schema } from 'mongoose';

export const ProductSchema = new Schema({
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

export const UserSchema = new Schema({
    fname: String,
    lname: String,
    email: String,
    isAdmin: Boolean
})