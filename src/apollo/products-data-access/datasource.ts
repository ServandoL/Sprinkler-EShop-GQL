import { DataSource } from 'apollo-datasource';
import {
  MongoClient,
  Collection,
  Db,
  Filter,
  Document,
  UpdateFilter,
  ModifyResult,
  ObjectId,
} from 'mongodb';
import {
  AddProductRequest,
  DeleteRequest,
  FilterResponse,
  IProduct,
  ProductRequest,
  Rating,
  ReviewRequest,
  UpdateProductRequest,
} from './models/interfaces';
import * as env from '../../../config';
import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import { BRAND, CATEGORY } from './constants';
import { Page, PaginatedResponse } from '../../interfaces/interfaces';
import { Paginate } from '../../common/pagination';

export class ProductDatasource extends DataSource {
  client!: MongoClient;
  collection!: Collection<IProduct>;
  db!: Db;
  loc = 'ProductDatasource';
  constructor(client: MongoClient) {
    super();
    this.client = client;
    this.db = this.client.db(env.database);
    this.collection = this.db.collection(env.newProducts);
  }

  async getProductFilters(request: string[]) {
    try {
      const response: FilterResponse = {
        brands: [],
        categories: [],
        success: false,
      };
      const [error, data] = await to(this.collection.find().toArray());
      if (error) {
        return new ApolloError(
          `An error occurred while retrieving the product filters. ${JSON.stringify(error)}`
        );
      } else {
        request.forEach((filter) => {
          if (data) {
            data.forEach((product) => {
              if (filter === BRAND && !response.brands.includes(product.brand)) {
                response.brands.push(product.brand);
              }
              if (filter === CATEGORY && !response.categories.includes(product.category)) {
                response.categories.push(product.category);
              }
            });
          }
        });
        return {
          ...response,
          success: true,
        } as FilterResponse;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while retrieving the products. ${JSON.stringify(error)}`
      );
    }
  }

  async getProducts(request: ProductRequest): Promise<PaginatedResponse | ApolloError | undefined> {
    try {
      const pageOptions: Page = {
        pageNumber: request.page.pageNumber,
        pageSize: request.page.pageSize,
      };
      const query: Filter<IProduct> =
        request.category !== undefined ? { category: request.category, isDeleted: false } : {};

      const searchAggregate: Document[] = [
        {
          $match: {
            ...query,
          },
        },
      ];

      const [error, data] = await to(Paginate(this.collection, searchAggregate, pageOptions));

      if (error) {
        return new ApolloError(
          `An error occurred while retrieving the products. ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while retrieving the products. ${JSON.stringify(error)}`
      );
    }
  }

  async getAllProducts(
    request: ProductRequest
  ): Promise<PaginatedResponse | ApolloError | undefined> {
    try {
      const pageOptions: Page = {
        pageNumber: request.page.pageNumber,
        pageSize: request.page.pageSize,
      };
      const searchAggregate: Document[] = [
        {
          $match: {},
        },
      ];
      const [error, data] = await to(Paginate(this.collection, searchAggregate, pageOptions));
      if (error) {
        return new ApolloError(
          `An error occurred while retrieving the products. ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while retrieving the products. ${JSON.stringify(error)}`
      );
    }
  }

  async softDeleteProduct(
    request: DeleteRequest
  ): Promise<ModifyResult<IProduct> | undefined | ApolloError> {
    try {
      const filter: Filter<IProduct> = {
        _id: request.product._id.toString(),
      };
      const update: UpdateFilter<IProduct> = {
        $set: {
          isDeleted: true,
          deleted_by: request.email,
          deleted_date: new Date().toISOString(),
        },
      };
      const [error, data] = await to(this.collection.findOneAndUpdate(filter, update));
      if (error) {
        return new ApolloError(
          `An error occurred while retrieving the products. ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while retrieving the products. ${JSON.stringify(error)}`
      );
    }
  }

  async createProduct(request: AddProductRequest) {
    try {
      const [error, data] = await to(
        this.collection.insertOne({
          ...request,
          createdDate: new Date().toISOString(),
          _id: new ObjectId().toString(),
        })
      );
      if (error) {
        return new ApolloError(
          `'An error occurred trying to add the product.' ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      return new ApolloError(
        `'An error occurred trying to add the product.' ${JSON.stringify(error)}`
      );
    }
  }

  async updateProduct(request: UpdateProductRequest) {
    console.log(this.loc + '.updateProduct', `Request: ${JSON.stringify(request)}`);
    try {
      const filter: Filter<IProduct> = { _id: request.productId };
      const [error, data] = await to(this.collection.findOne(filter));
      if (error) {
        return new ApolloError(
          `An error occurred while trying to update this product. ${JSON.stringify(error)}`
        );
      } else {
        const { modified, ...product } = data as unknown as IProduct;
        console.log(modified);
        if (modified) {
          const update: UpdateFilter<IProduct> = {
            $set: {
              ...request,
              lastModifiedDate: request.modifiedDate,
              modified: [...modified, request],
            },
          };
          return await this.collection.findOneAndUpdate(filter, update);
        } else {
          const update: UpdateFilter<IProduct> = {
            $set: {
              ...product,
              ...request,
              modified: [request],
            },
          };
          return await this.collection.findOneAndUpdate(filter, update);
        }
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to update this product. ${JSON.stringify(error)}`
      );
    }
  }

  protected updateProductRating(product: IProduct) {
    const reviews = product.ratings?.length ? [...product.ratings] : [];
    let rating = 0;
    reviews.forEach((review) => {
      rating += review.rate;
    });
    product.rating = reviews.length > 0 ? rating / reviews.length : 0;
  }

  async reviewProduct(request: ReviewRequest) {
    try {
      const newRating: Rating = {
        rate: request.rate,
        review: request.review,
        createdDate: new Date().toISOString(),
        name: request.name,
        headLine: request.headLine,
      };
      const filter: Filter<IProduct> = { _id: request.productId };
      const [error, data] = await to(this.collection.findOne(filter));
      if (error) {
        return new ApolloError(
          `An error occurred while trying to review this product. ${JSON.stringify(error)}`
        );
      } else {
        const { ratings, rating, ...product } = data as unknown as IProduct;
        if (ratings?.length) {
          let updatedRating = request.rate;
          ratings.forEach((rating) => {
            updatedRating += rating.rate;
          });
          const update: UpdateFilter<IProduct> = {
            $set: {
              ...product,
              rating: updatedRating / (ratings.length + 1),
              ratings: [...ratings, newRating],
            },
          };
          return await this.collection.findOneAndUpdate(filter, update);
        } else {
          const update: UpdateFilter<IProduct> = {
            $set: {
              ...product,
              rating: request.rate,
              ratings: [newRating],
            },
          };
          return await this.collection.findOneAndUpdate(filter, update);
        }
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to review this product. ${JSON.stringify(error)}`
      );
    }
  }
}
