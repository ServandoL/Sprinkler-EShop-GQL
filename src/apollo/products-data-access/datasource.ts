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
  IProduct,
  FilterResponse,
  ProductRequest,
  DeleteRequest,
  AddProductRequest,
  UpdateProductRequest,
  ReviewRequest,
  Rating,
  CurrentProduct,
  FindProductRequest,
} from './models/interfaces';
import * as env from '../../../config';
import to from 'await-to-js';
import { BRAND, CATEGORIES, CATEGORY, PRICE_RANGE, RATING, SEARCH } from './constants';
import { Page, PaginatedResponse } from '../../interfaces/interfaces';
import { Paginate } from '../../common/pagination';
import { GraphQLError } from 'graphql';

export class ProductDatasource {
  client!: MongoClient;
  collection!: Collection<IProduct>;
  db!: Db;
  loc = 'ProductDatasource';
  constructor(client: MongoClient) {
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
        throw new GraphQLError(
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
      throw new GraphQLError(
        `An error occurred while retrieving the products. ${JSON.stringify(error)}`
      );
    }
  }

  async getProducts(
    request: ProductRequest
  ): Promise<PaginatedResponse | GraphQLError | undefined> {
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
        throw new GraphQLError(
          `An error occurred while retrieving the products. ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      throw new GraphQLError(
        `An error occurred while retrieving the products. ${JSON.stringify(error)}`
      );
    }
  }

  async getAllProducts(
    request: ProductRequest
  ): Promise<PaginatedResponse | GraphQLError | undefined> {
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
        throw new GraphQLError(
          `An error occurred while retrieving the products. ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      throw new GraphQLError(
        `An error occurred while retrieving the products. ${JSON.stringify(error)}`
      );
    }
  }

  async softDeleteProduct(
    request: DeleteRequest
  ): Promise<ModifyResult<IProduct> | undefined | GraphQLError> {
    try {
      const filter: Filter<IProduct> = {
        _id: new ObjectId(request.product._id),
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
        throw new GraphQLError(
          `An error occurred while retrieving the products. ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      throw new GraphQLError(
        `An error occurred while retrieving the products. ${JSON.stringify(error)}`
      );
    }
  }

  async createProduct(request: AddProductRequest) {
    try {
      const [error, data] = await to(
        this.collection.insertOne({
          ...request,
          rating: 0,
          ratings: [],
          createdDate: new Date().toISOString(),
          _id: new ObjectId(),
        })
      );
      if (error) {
        throw new GraphQLError(
          `'An error occurred trying to add the product.' ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      throw new GraphQLError(
        `'An error occurred trying to add the product.' ${JSON.stringify(error)}`
      );
    }
  }

  async updateProduct(request: UpdateProductRequest) {
    console.log(this.loc + '.updateProduct', `Request: ${JSON.stringify(request)}`);
    try {
      const filter: Filter<IProduct> = { _id: new ObjectId(request.productId) };
      const [error, data] = await to(this.collection.findOne(filter));
      if (error) {
        throw new GraphQLError(
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
      throw new GraphQLError(
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
      const filter: Filter<IProduct> = { _id: new ObjectId(request.productId) };
      const [error, data] = await to(this.collection.findOne(filter));
      if (error) {
        throw new GraphQLError(
          `An error occurred while trying to review this product. ${JSON.stringify(error)}`
        );
      } else {
        const { ratings, ...product } = data as unknown as IProduct;
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
          const result = await this.collection.findOneAndUpdate(filter, update);
          if (result.ok) {
            const product = await this.collection.findOne(filter);
            return {
              message: 'Product reviewed successfully.',
              success: true,
              product: product,
            };
          } else {
            throw new GraphQLError('An error occurred while updating your product.');
          }
        } else {
          const update: UpdateFilter<IProduct> = {
            $set: {
              ...product,
              rating: request.rate,
              ratings: [newRating],
            },
          };
          const result = await this.collection.findOneAndUpdate(filter, update);
          if (result.ok) {
            const product = await this.collection.findOne(filter);
            return {
              message: 'Product reviewed successfully.',
              success: true,
              product: product,
            };
          } else {
            throw new GraphQLError('An error occurred while updating your product.');
          }
        }
      }
    } catch (error) {
      throw new GraphQLError(
        `An error occurred while trying to review this product. ${JSON.stringify(error)}`
      );
    }
  }

  async getCurrentProduct(_id: string): Promise<CurrentProduct | null> {
    const filter: Filter<IProduct> = { _id: new ObjectId(_id) };
    try {
      const [error, data] = await to(this.collection.findOne(filter));
      if (error) {
        throw new GraphQLError('An error occurred trying to fetch the product.');
      } else {
        return data ? { product: data } : null;
      }
    } catch (error) {
      throw new GraphQLError('An error occured trying to fetch the product.');
    }
  }

  async getFilteredProducts(request: FindProductRequest) {
    console.log(request);
    const filter: Filter<Partial<IProduct>> = {};
    const pageOptions: Page = {
      pageNumber: request.page.pageNumber,
      pageSize: request.page.pageSize,
    };
    for (const [k, v] of Object.entries(request)) {
      if (k === CATEGORIES) {
        if (request.categories.length === 1) {
          filter.category = v[0];
        }
        if (request.categories.length > 1) {
          filter.category = { $in: v };
        }
      }
      if (k === BRAND) {
        if (request.brand.length === 1) {
          filter.brand = v[0];
        }
        if (request.brand.length > 1) {
          filter.brand = { $in: v };
        }
      }
      if (k === PRICE_RANGE) {
        if (request.priceRange.length) {
          if (v[0] && v[1]) {
            filter.price = { $gte: v[0], $lte: v[1] };
          }
          if (!v[0] && v[1]) {
            filter.price = { $lte: v[1] };
          }
        }
      }
      if (k === SEARCH) {
        if (v) {
          filter['$text'] = { $search: v };
        }
      }
      if (k === RATING) {
        if (v) {
          filter.rating = { $gte: v, $lt: v + 1 };
        }
      }
    }
    console.log('FilteredProducts: Generated query: ', filter);
    try {
      const [error, data] = await to(Paginate(this.collection, [{ $match: filter }], pageOptions));
      if (error) {
        throw new GraphQLError(
          `An error occurred while retrieving the products. ${JSON.stringify(error)}`
        );
      } else {
        console.log('results', data);
        return data;
      }
    } catch (error) {
      throw new GraphQLError('An error occured trying to fetch the product.');
    }
  }
}
