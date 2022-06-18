import { ApolloError } from 'apollo-server';
import mongoose, {
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  Query,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import to from 'await-to-js';
import {
  AddProductRequest,
  DeletedResponse,
  DeleteRequest,
  IProduct,
  ProductRequest,
  ProductResponse,
} from './models/interfaces';
import * as env from '../../config';
import { ProductSchema } from './models/products.schema';
const ProductModel = mongoose.model<IProduct, PaginateModel<IProduct>>(
  env.productsCollection,
  ProductSchema
);
export async function getProducts(
  request: ProductRequest
): Promise<ProductResponse | ApolloError> {
  try {
    const pageOptions: PaginateOptions = {
      page: request.page.pageNumber,
      limit: request.page.pageSize,
    };
    const query: FilterQuery<ProductResponse> =
      request.category !== undefined ? { category: request.category } : {};
    const [error, data] = await to(ProductModel.paginate(query, pageOptions));

    if (error) {
      return new ApolloError(
        `An error occurred while retrieving the products. ${JSON.stringify(
          error
        )}`
      );
    } else {
      const { docs, ...pagination } = data as PaginateResult<IProduct>;
      return {
        data: [...docs],
        pagination: { ...pagination },
      } as unknown as ProductResponse;
    }
  } catch (error) {
    return new ApolloError(
      `An error occurred while retrieving the products. ${JSON.stringify(
        error
      )}`
    );
  }
}

export async function getAllProducts(
  request: ProductRequest
): Promise<ProductResponse | ApolloError> {
  try {
    console.log(request);
    const pageOptions: PaginateOptions = {
      page: request.page.pageNumber,
      limit: request.page.pageSize,
    };
    const [error, data] = await to(ProductModel.paginate({}, pageOptions));
    if (error) {
      return new ApolloError(
        `An error occurred while retrieving the products. ${JSON.stringify(
          error
        )}`
      );
    } else {
      const { docs, ...pagination } = data as PaginateResult<IProduct>;
      return {
        data: [...docs],
        pagination: { ...pagination },
      } as unknown as ProductResponse;
    }
  } catch (error) {
    return new ApolloError(
      `An error occurred while retrieving the products. ${JSON.stringify(
        error
      )}`
    );
  }
}

export async function softDeleteProduct(
  request: DeleteRequest
): Promise<IProduct | ApolloError | null> {
  try {
    const filter: FilterQuery<IProduct> = { _id: request.product._id };
    const update: UpdateQuery<IProduct> = {
      isDeleted: true,
      deleted_by: request.email,
      deleted_date: new Date().toISOString(),
    };
    const result = ProductModel.findOneAndUpdate(filter, update, {
      returnDocument: 'after',
    });
    return result;
  } catch (error) {
    return new ApolloError(
      `An error occurred while retrieving the products. ${JSON.stringify(
        error
      )}`
    );
  }
}

export async function addNewProduct(request: AddProductRequest) {
  try {
    const result = await ProductModel.create({
      ...request,
      addedDate: new Date().toISOString(),
    });
    return result;
  } catch (error) {
    return new ApolloError(
      `An error occurred while creating the new product. ${JSON.stringify(
        error
      )}`
    );
  }
}
