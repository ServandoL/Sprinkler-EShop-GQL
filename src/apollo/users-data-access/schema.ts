export const UserTypeDefs = `#graphql
  type Query {
    getUser(email: String, password: String): getUserResponse
  }

  type Mutation {
    addUser(request: AddUserInput): genericResponse
    deleteUser(_id: String): genericResponse
    updateUserInformation(request: UpdateUserInput): genericResponse
  }

  input AddUserInput {
    fname: String
    lname: String
    email: String
    password: String
    isAdmin: Boolean
  }

  input UpdateUserInput {
    _id: String!
    currentPassword: String!
    email: String
    newPassword: String
  }

  type genericResponse {
    message: String
    success: Boolean
  }

  type getUserResponse {
    message: String
    success: Boolean
    user: User
  }

  type User {
    _id: ID
    fname: String
    lname: String
    email: String
    password: String
    isAdmin: Boolean
  }
`;
