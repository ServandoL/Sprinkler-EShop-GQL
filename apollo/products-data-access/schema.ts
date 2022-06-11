import { gql } from "apollo-server";

export const productsTypeDef = gql`
  type Query {
    products(productRequest: ProductInput): getProductResponse
    allProducts(productRequest: ProductInput): getProductResponse
  }

  type Mutation {
    addProduct(
      productName: String
      price: Float
      category: String
      brand: String
      stock: Int
    ): addProductResponse

    deleteProduct(_id: ID): deleteProductResponse
  }

  input ProductInput {
    productName: String
    price: Float
    category: String
    brand: String
    stock: Int
    isDeleted: Boolean
    deleted_by: String
    deleted_date: String
    page: Page
  }

  type getProductResponse {
    data: [Product]
    pagination: Pagination
  }

  type deleteProductResponse {
    message: String
    success: Boolean
  }

  type addProductResponse {
    message: String
    success: Boolean
    product: Product
  }

  type Product {
    _id: ID!
    productName: String!
    price: Float!
    category: String!
    brand: String!
    stock: Int!
    imageUrl: String
    isDeleted: Boolean
    deleted_by: String
    deleted_date: String
  }

  input Page {
    pageSize: Int
    pageNumber: Int
  }

  type Pagination {
    totalDocs: Int;
    limit: Int;
    hasPrevPage: Boolean;
    hasNextPage: Boolean;
    page: Int;
    totalPages: Int;
    offset: Int;
    prevPage: Int;
    nextPage: Int;
    pagingCounter: Int;
  }
`;
