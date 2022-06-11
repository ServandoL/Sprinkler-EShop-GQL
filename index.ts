import { ApolloServer } from "apollo-server";
import mongoose from "mongoose";
import { resolvers } from "./apollo/products-data-access/resolvers";
import { productsTypeDef } from "./apollo/products-data-access/schema";
import { MongoServer } from "./server/server";
import * as env from "./config";
import { ProductDataSource } from "./apollo/products-data-access/datasource";

async function main() {
  const connectionString = env.connectionString;
  const port = env.port;

  await mongoose.connect(connectionString);

  const dataSources = () => ({
    productsApi: new ProductDataSource(mongoose.connection),
    usersApi: new MongoServer(mongoose.connection),
    cartApi: new MongoServer(mongoose.connection),
    ordersApi: new MongoServer(mongoose.connection),
  });

  const server = new ApolloServer({
    typeDefs: [productsTypeDef],
    resolvers,
    dataSources,
    introspection: true,
  });

  server.listen({ port: port }).then(({ url }) => {
    console.log(`index`, `Apollo server listening on ${url}`);
  });
}

main().catch((error) =>
  console.log(
    `index`,
    `An error occurred while creating connections. ${JSON.stringify(error)}`
  )
);
