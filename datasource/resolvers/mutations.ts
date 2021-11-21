import mongoose from "mongoose";
import { ProductSchema, UserSchema } from "../../mongo/models";
import * as Interface from "../../interfaces/interfaces";

const Product = mongoose.model("Product", ProductSchema);
const User = mongoose.model("User", UserSchema);

export const Mutations = {
  Mutation: {
    addProduct(parent: any, args: Interface.IProduct, context: any, info: any) {
      const { productName, price, category, brand, stock } = args;
      const product = new Product({
        productName,
        price,
        category,
        brand,
        stock,
      });
      return product
        .save()
        .then((result: { _doc: any }) => {
          return { ...result._doc };
        })
        .catch((err: any) => {
          console.error(err);
        });
    },
    addUser(parent: any, args: Interface.IUser, context: any, info: any) {
      const { fname, lname, email, isAdmin } = args;
      const user = new User({
        fname,
        lname,
        email,
        isAdmin,
      });
      return user
        .save()
        .then((result: { _doc: any }) => {
          return { ...result._doc };
        })
        .catch((err: any) => {
          console.error(err);
        });
    },
  },
};
