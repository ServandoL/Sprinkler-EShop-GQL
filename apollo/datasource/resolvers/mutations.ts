import mongoose from "mongoose";
import { IProduct, IUser } from "../../../interfaces/interfaces";

export const Mutation = {
  // addProduct: (
  //   parent: any,
  //   args: IProduct,
  //   context: any,
  //   info: any
  // ) => {
  //   const { productName, price, category, brand, stock } = args;
  //   const product = new Product({
  //     productName,
  //     price,
  //     category,
  //     brand,
  //     stock,
  //   });
  //   return product
  //     .save()
  //     .then((result) => {
  //       return { ...result };
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //     });
  // },
  // addUser: (parent: any, args: IUser, context: any, info: any) => {
  //   const { fname, lname, email, isAdmin } = args;
  //   const user = new User({
  //     fname,
  //     lname,
  //     email,
  //     isAdmin,
  //   });
  //   return user
  //     .save()
  //     .then((result) => {
  //       return { ...result };
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //     });
  // },
};
