import { gql } from 'apollo-server';

export const ProductsTypeDef = gql`
  type Query {
    products(productRequest: ProductInput): getProductResponse
    allProducts(productRequest: ProductInput): getProductResponse
  }

  type Mutation {
    addProduct(addProductRequest: AddProductRequest): addProductResponse

    deleteProduct(deleteRequest: DeleteRequest): deleteProductResponse
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

  input DeleteProductItem {
    _id: String!
    productName: String
    price: Float
    category: String
    brand: String
    stock: Int
    imageUrl: String
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
  }

  type Product {
    _id: String
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

  input DeleteRequest {
    product: DeleteProductItem
    email: String
  }

  input AddProductRequest {
    productName: String!
    price: Float!
    category: String!
    brand: String!
    stock: Int!
    imageUrl: String
    addedBy: String
  }

  input Page {
    pageSize: Int
    pageNumber: Int
  }

  type Pagination {
    totalDocs: Int
    limit: Int
    hasPrevPage: Boolean
    hasNextPage: Boolean
    page: Int
    totalPages: Int
    offset: Int
    prevPage: Int
    nextPage: Int
    pagingCounter: Int
  }
`;
