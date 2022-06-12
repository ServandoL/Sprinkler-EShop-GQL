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

export async function getProducts(
  request: ProductRequest,
  model: PaginateModel<IProduct>
): Promise<ProductResponse | ApolloError> {
  try {
    const pageOptions: PaginateOptions = {
      page: request.page.pageNumber,
      limit: request.page.pageSize,
    };
    const [error, data] = await to(
      model.paginate({ category: request.category }, pageOptions)
    );

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
  request: ProductRequest,
  model: PaginateModel<IProduct>
): Promise<ProductResponse | ApolloError> {
  try {
    console.log(request);
    const pageOptions: PaginateOptions = {
      page: request.page.pageNumber,
      limit: request.page.pageSize,
    };
    const [error, data] = await to(model.paginate({}, pageOptions));
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
  request: DeleteRequest,
  model: mongoose.Model<IProduct>
): Promise<IProduct | ApolloError | null> {
  try {
    const filter: FilterQuery<IProduct> = { _id: request.product._id };
    const update: UpdateQuery<IProduct> = {
      isDeleted: true,
      deleted_by: request.email,
      deleted_date: new Date().toISOString(),
    };
    const result = model.findOneAndUpdate(filter, update, {
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

export async function addNewProduct(
  request: AddProductRequest,
  model: mongoose.Model<IProduct>
) {
  try {
    const result = await model.create({
      ...request,
      addedDate: new Date().toISOString(),
    });
    console.log('results', result);
  } catch (error) {
    return new ApolloError(
      `An error occurred while creating the new product. ${JSON.stringify(
        error
      )}`
    );
  }
}
