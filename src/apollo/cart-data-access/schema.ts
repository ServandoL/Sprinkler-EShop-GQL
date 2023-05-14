export const CartTypeDefs = `#graphql
  type Query {
    getCart(userId: String): getCartResponse
  }

  type Mutation {
    saveCart(request: SaveCartRequest): genericResponse
    addToCart(request: AddToCartInput): genericResponse
    clearCart(userId: String): genericResponse
    updateCart(request: CartInput): genericResponse
  }

  input SaveCartRequest {
    cart: [CartInput]
    userId: String
  }

  input UpdateCartQuantity {
    email: String
    _id: ID
    quantity: Int
  }

  input AddToCartInput {
    _id: String
    userId: String
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
    userId: String
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
