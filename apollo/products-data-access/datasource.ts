import { DataSource } from "apollo-datasource";
import { ApolloError } from "apollo-server";
import mongoose, { PaginateModel, PaginateOptions } from "mongoose";
import { IProduct, ProductRequest } from "../../interfaces/interfaces";
import * as env from "../../config";
import { ProductSchema } from "./models/products.model";
import to from "await-to-js";

export class ProductDataSource extends DataSource {
  connection!: mongoose.Connection;
  ProductModel!: PaginateModel<IProduct>;

  constructor(connection: mongoose.Connection) {
    super();
    this.connection = connection;
    this.ProductModel = this.connection.model<
      IProduct,
      PaginateModel<IProduct>
    >(env.productsCollection, ProductSchema);
  }

  async getProducts(request: ProductRequest) {
    try {
      const pagination: PaginateOptions = {
        page: request.page.pageNumber,
        limit: request.page.pageSize,
      };
      const [error, data] = await to(
        this.ProductModel.paginate({ category: request.category }, pagination)
      );

      if (error) {
        return new ApolloError(
          `An error occurred while retrieving the products. ${JSON.stringify(
            error
          )}`
        );
      } else {
        const { docs, ...pagination } = data;
        return {
          data: [...docs],
          pagination: { ...pagination },
        } as unknown as ProductRequest;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while retrieving the products. ${JSON.stringify(
          error
        )}`
      );
    }
  }

  async getAllProducts(request: ProductRequest) {
    try {
      const pagination: PaginateOptions = {
        page: request.page.pageNumber,
        limit: request.page.pageSize,
      };
      const [error, data] = await to(
        this.ProductModel.paginate({}, pagination)
      );
      if (error) {
        return new ApolloError(
          `An error occurred while retrieving the products. ${JSON.stringify(
            error
          )}`
        );
      } else {
        const { docs, ...pagination } = data;
        return {
          data: [...docs],
          pagination: { ...pagination },
        } as unknown as ProductRequest;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while retrieving the products. ${JSON.stringify(
          error
        )}`
      );
    }
  }
}
