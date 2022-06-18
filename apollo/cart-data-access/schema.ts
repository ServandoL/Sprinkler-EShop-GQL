import { gql } from 'apollo-server';

export const CartTypeDefs = gql`
  type Query {
    getCart(email: String): getCartResponse
  }

  type Mutation {
    saveCart(request: SaveCartRequest): genericResponse
    addToCart(request: AddToCartInput): genericResponse
    clearCart(email: String): genericResponse
    updateCart(request: CartInput): genericResponse
  }

  input SaveCartRequest {
    cart: [CartInput]
    email: String
  }

  input UpdateCartQuantity {
    email: String
    _id: ID
    quantity: Int
  }

  input AddToCartInput {
    _id: ID
    email: String
    quantity: Int
    productName: String
    price: Float
    category: String
    brand: String
    stock: Int
    imageUrl: String
  }

  input CartInput {
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

  type genericResponse {
    message: String
    success: Boolean
  }

  type getCartResponse {
    cart: [Cart]
    email: String
  }

  type Cart {
    _id: ID
    productName: String
    price: Float
    category: String
    brand: String
    stock: Int
    imageUrl: String
    quantity: Int
  }
`;