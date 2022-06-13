import { gql } from 'apollo-server';

export const CartTypeDefs = gql`
  type Query {
    getCart(email: String): getCartResponse
  }

  type Mutation {
    saveCart(request: SaveCartRequest): genericResponse
    addToCart(request: AddToCartInput): genericResponse
    clearCart(email: String): genericResponse
    updateCart(request: UpdateCartQuantity): genericResponse
  }

  input SaveCartRequest {
    cart: [CartInput]
    email: String
  }

  input UpdateCartQuantity {
    email: String
    productName: String
    quantity: Int
  }

  input AddToCartInput {
    _id: String
    quantity: Int
    productName: String
    price: Float
    category: String
    brand: String
    stock: Int
    imageUrl: String
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

  type genericResponse {
    message: String
    success: Boolean
  }

  type getCartResponse {
    cart: [Cart]
    email: String
  }

  type Cart {
    _id: String
    productName: String
    price: Float
    category: String
    brand: String
    stock: Int
    imageUrl: String
    quantity: Int
  }
`;
