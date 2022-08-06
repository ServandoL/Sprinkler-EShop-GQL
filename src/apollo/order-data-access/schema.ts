import { gql } from 'apollo-server';

export const OrderTypeDefs = gql`
  type Query {
    orders(orderHistoryRequest: OrderHistoryRequest): getOrderResponse
  }

  type Mutation {
    createOrder(request: OrderInput): genericResponse
  }

  input OrderHistoryRequest {
    userId: String
    page: Page
  }

  type getOrderResponse {
    data: [OrderType]
    pagination: Pagination
  }

  type genericResponse {
    message: String
    success: Boolean
  }

  input OrderInput {
    userId: String
    email: String
    order: [CartInput]
    shipping: ShippingInput
    payment: PaymentInput
    total: Float
  }

  input ShippingInput {
    address: String
    address2: String
    city: String
    state: String
    zipCode: String
  }

  input PaymentInput {
    cardNumber: String
    month: String
    year: String
    cvv: String
  }

  input CartInput {
    _id: String
    email: String
    productName: String
    price: Float
    category: String
    brand: String
    stock: Int
    imageUrl: String
    quantity: Int
  }

  type OrderType {
    _id: ID
    order: [Cart]
    shipping: ShippingType
    payment: PaymentType
    email: String
    orderedDate: String
    total: Float
    orderId: String
  }

  type ShippingType {
    address: String
    address2: String
    city: String
    state: String
    zipCode: String
  }

  type PaymentType {
    cardNumber: String
    month: String
    year: String
    cvv: String
  }

  type Cart {
    _id: ID
    email: String
    productName: String
    price: Float
    category: String
    brand: String
    stock: Int
    imageUrl: String
    quantity: Int
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
