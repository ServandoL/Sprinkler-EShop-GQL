import { ApolloError } from 'apollo-server';
import mongoose, {
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  UpdateQuery,
} from 'mongoose';
import to from 'await-to-js';
import {
  AddProductRequest,
  DeleteRequest,
  FilterResponse,
  IProduct,
  ProductRequest,
  ProductResponse,
  UpdateProductRequest,
} from './models/interfaces';
import * as env from '../../config';
import { ProductSchema } from './models/products.schema';
const ProductModel = mongoose.model<IProduct, PaginateModel<IProduct>>(
  env.productsCollection,
  ProductSchema
);

export async function getProductFilters(request: string[]) {
  try {
    let response: FilterResponse = {
      brands: [],
      categories: [],
      success: false,
    };
    const [error, data] = await to(ProductModel.find({}).exec());
    if (error) {
      return new ApolloError(
        `An error occurred while retrieving the products. ${JSON.stringify(
          error
        )}`
      );
    } else {
      if (data) {
        for (const filter of request) {
          for (const product of data) {
            if (
              filter === 'brand' &&
              !response.brands.includes(product.brand)
            ) {
              response.brands.push(product.brand);
            }
            if (
              filter === 'category' &&
              !response.categories.includes(product.category)
            ) {
              response.categories.push(product.category);
            }
          }
        }
        return {
          ...response,
          success: true,
        } as FilterResponse;
      }
      return response;
    }
  } catch (error) {
    return new ApolloError(
      `An error occurred while retrieving the products. ${JSON.stringify(
        error
      )}`
    );
  }
}

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

export async function updateProduct(request: UpdateProductRequest) {
  try {
    const filter: FilterQuery<IProduct> = { _id: request.productId };
    const [error, data] = await to(ProductModel.findOne(filter).exec());
    if (error) {
      return new ApolloError(
        `An error occurred while trying to update this product. ${JSON.stringify(
          error
        )}`
      );
    } else {
      const { modified, ...product } = data as unknown as IProduct;
      if (modified) {
        return await ProductModel.findOneAndUpdate(
          filter,
          {
            ...request,
            lastModifiedDate: request.modifiedDate,
            modified: [...modified, request],
          },
          { returnDocument: 'after' }
        );
      }
    }
  } catch (error) {
    return new ApolloError(
      `An error occurred while trying to update this product. ${JSON.stringify(
        error
      )}`
    );
  }
}
