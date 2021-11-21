
import mongoose from "mongoose";
import { ProductSchema, UserSchema } from "../../mongo/models";

const Product = mongoose.model("Product", ProductSchema);
const User = mongoose.model("User", UserSchema);

export const Query = {
  async products(parent: any, args: any, context: any, info: any) {
    try {
      const product = await Product.find();
      return product.map((result) => ({ ...result._doc }));
    } catch (err) {
      console.error(err);
    }
  },
  async users(parent: any, args: any, context: any, info: any) {
    try {
      const user = await User.find();
      return user.map((result) => ({ ...result._doc }));
    } catch (err) {
      console.error(err);
    }
  },
  async productById(parent: any, args: any, context: any, info: any) {
    try {
      const product = await Product.findOne({ _id: args.id });
      return { ...product._doc };
    } catch (err) {
      console.error(err);
    }
  },
  async userById(parent: any, args: any, context: any, info: any) {
    try {
      const user = await User.findOne({ _id: args.id });
      return { ...user._doc };
    } catch (err) {
      console.error(err);
    }
  },
};
