export const ProductsTypeDef = `#graphql
  type Query {
    products(productRequest: ProductInput): getProductResponse
    allProducts(productRequest: ProductInput): getProductResponse
    getFilters(filterRequest: FilterInput): getFilterResponse
    getCurrentProduct(productId: String!): getCurrentProductResponse
    findProducts(filterRequest: FindProductInput): getProductResponse
  }

  type Mutation {
    addProduct(addProductRequest: AddProductRequest): addProductResponse

    deleteProduct(deleteRequest: DeleteRequest): deleteProductResponse

    updateProduct(updateRequest: UpdateProductRequest): genericResponse

    reviewProduct(reviewRequest: ReviewRequest): ReviewProductResponse
  }

  type getCurrentProductResponse {
    product: Product
  }

  input FindProductInput {
    brand: [String]
    categories: [String]
    priceRange: [Int]
    rating: Int
    search: String
    page: Page!
  }

  input ReviewRequest {
    productId: ID!
    name: String
    review: String
    headLine: String
    rate: Int
    createdDate: String
  }

  input FilterInput {
    filters: [String]
  }

  type getFilterResponse {
    brands: [String]
    categories: [String]
    success: Boolean
  }

  input UpdateProductRequest {
    productId: ID
    modifiedBy: String
    modifiedDate: String
    productName: String
    price: Float
    stock: Int
    imageUrl: String
  }

  type genericResponse {
    message: String
    success: Boolean
  }

  type ReviewProductResponse {
    message: String
    success: Boolean
    product: Product
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
    page: Page!
  }

  input DeleteProductItem {
    _id: ID!
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
    _id: ID
    productName: String!
    price: Float!
    category: String!
    brand: String!
    stock: Int!
    imageUrl: String
    rating: Float
    ratings: [Rating]
    isDeleted: Boolean
    deleted_by: String
    deleted_date: String
  }

  type Rating {
    name: String
    review: String
    rate: Int
    headLine: String
    createdDate: String
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
    createdBy: String!
  }

  input Page {
    pageSize: Int!
    pageNumber: Int!
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
