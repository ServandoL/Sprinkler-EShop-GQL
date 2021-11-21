import mongoose from "mongoose";
import { ProductSchema } from "./schemas";

main().catch((err) => console.log(err));

async function main() {
  
  const conn = mongoose
    .createConnection("mongodb://localhost:27017/web_store", {
      connectTimeoutMS: 1000,
    });


  const ProductModel = conn.model("Product", ProductSchema);

  const products = await ProductModel.find({
    _id: "3f304efc-9bdf-11eb-bc13-1b053fbda344",
  });
  console.log(products);
}