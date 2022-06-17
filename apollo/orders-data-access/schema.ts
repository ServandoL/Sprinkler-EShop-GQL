import { gql } from 'apollo-server';

export const OrderTypeDefs = gql`
  type Query {
    orders(email: String): getOrderResponse
  }

  type Mutation {
    createOrder(request: OrderInput): genericResponse
  }

  type getOrderResponse {
    orders: [OrderType]
    message: String
    success: Boolean
  }

  type genericResponse {
    message: String
    success: Boolean
  }

  input OrderInput {
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
    _id: String
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
`;
