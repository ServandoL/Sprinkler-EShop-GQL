import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
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

    cart(user_id: String): [Cart]
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
      quantity: Float,
      productName: String
      price: Float
      category: String
      brand: String
      stock: Int
      imageUrl: String
    ): addToCartResponse
  }

  type addToCartResponse {
    message: String
    success: Boolean
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
    _id: ID!
    user_id: String!
    product: Product!
    quantity: Int!
  }
`;
