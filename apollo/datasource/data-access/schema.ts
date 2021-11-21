import { gql } from "apollo-server-express";

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

    productById(id: ID): Product

    users(_id: ID, email: String, isAdmin: Boolean): [User]

    userById(id: ID): User
  }

  type Mutation {
    addProduct(
      productName: String
      price: Float
      category: String
      brand: String
      stock: Int
    ): Product
    addUser(fname: String, lname: String, email: String, isAdmin: Boolean): User
  }

  type User {
    fname: String!
    lname: String!
    email: String!
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
`;
