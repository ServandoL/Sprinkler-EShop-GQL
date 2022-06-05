import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    cart(user_id: String): getCartResponse

    orders(email: String): [OrderType]

    products(
      _id: ID
      productName: String
      price: Float
      category: String
      brand: String
      stock: Int
      isDeleted: Boolean
      deleted_by: String
      deleted_date: String
    ): [Product]

    productById(_id: ID): Product

    users(_id: ID, email: String, isAdmin: Boolean, password: String): [User]
    userById(_id: ID): User
  }

  type Mutation {
    checkout(checkoutRequest: Order): checkoutResponse

    saveCart(cart: SaveCartRequest): saveCartResponse

    addProduct(
      productName: String
      price: Float
      category: String
      brand: String
      stock: Int
    ): addProductResponse

    deleteProduct(_id: ID): deleteProductResponse

    addUser(
      fname: String
      lname: String
      email: String
      password: String
      isAdmin: Boolean
    ): addUserResponse

    deleteUser(email: String): deleteUserResponse

    addToCart(
      user_id: String
      quantity: Int
      productName: String
      price: Float
      category: String
      brand: String
      stock: Int
      imageUrl: String
    ): addToCartResponse

    clearCart(user_id: String): removeFromCartResponse

    updateCartQuantity(
      user_id: String
      productName: String
      quantity: Int
    ): updateCartQuantityResponse
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

  type getCartResponse {
    cart: [Cart]
    user_id: String
    createdDate: String
  }

  type updateCartQuantityResponse {
    message: String
    success: Boolean
  }

  type removeFromCartResponse {
    message: String
    success: Boolean
  }

  type saveCartResponse {
    message: String
    success: Boolean
  }

  type checkoutResponse {
    message: String
    success: Boolean
  }

  type addToCartResponse {
    message: String
    success: Boolean
    product: Cart
  }

  type deleteProductResponse {
    message: String
    success: Boolean
  }

  type deleteUserResponse {
    message: String
    success: Boolean
  }

  type addProductResponse {
    message: String
    success: Boolean
    product: Product
  }

  type addUserResponse {
    message: String
    details: String
    success: Boolean
    user: User
  }

  type User {
    _id: ID!
    fname: String!
    lname: String!
    email: String!
    password: String!
    isAdmin: Boolean!
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

  type Cart {
    _id: ID
    user_id: String
    productName: String
    price: Float
    category: String
    brand: String
    stock: Int
    imageUrl: String
    quantity: Int
  }

  input CartInput {
    user_id: String
    productName: String
    price: Float
    category: String
    brand: String
    stock: Int
    imageUrl: String
    quantity: Int
  }

  input SaveCartRequest {
    cart: [CartInput]
    user_id: String
  }

  input CheckoutRequest {
    order: Order
  }

  input Order {
    order: [CartInput]
    shipping: Shipping
    payment: Payment
    email: String
    orderedDate: String
    total: Float
    orderId: String
  }

  input Shipping {
    address: String
    address2: String
    city: String
    state: String
    zipCode: String
  }

  input Payment {
    cardNumber: String
    month: String
    year: String
    cvv: String
  }
`;
