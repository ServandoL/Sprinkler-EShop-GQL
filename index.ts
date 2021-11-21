import { ApolloError, ApolloServer } from "apollo-server";
import { resolvers } from "./datasource/data-access/resolvers";
import { typeDefs } from "./datasource/data-access/schema";
import { ProductsApi } from "./datasource/datasource/products";
import { UsersApi } from "./datasource/datasource/users";

const dataSources = () => ({
  productsApi: new ProductsApi(),
  usersApi: new UsersApi()
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources
});

server
  .listen({
    port: process.env.port || 4000,
  })
  .then(({ url }) => {
    console.log(`Apollo server at ${url}`);
  });
