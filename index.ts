import { ApolloServer } from 'apollo-server';
import mongoose from 'mongoose';
import { ProductResolvers } from './apollo/products-data-access/resolvers';
import { productsTypeDef } from './apollo/products-data-access/schema';
import * as env from './config';

async function main() {
  const connectionString = env.connectionString;
  const database = env.database;
  const port = env.port;

  await mongoose.connect(connectionString, { dbName: database });

  const server = new ApolloServer({
    typeDefs: [productsTypeDef],
    resolvers: [ProductResolvers],
    introspection: true,
  });

  server.listen({ port: port }).then(({ url }) => {
    console.log(`index:`, `Apollo server listening on ${url}`);
  });
}

main().catch((error) =>
  console.log(
    `index:`,
    `An error occurred while creating connections. ${JSON.stringify(error)}`
  )
);

process.on('SIGINT', gracefulDisconnect).on('SIGTERM', gracefulDisconnect);

function gracefulDisconnect() {
  mongoose.connection.close(() => {
    console.log(
      `Mongoose connection was disconnected through app termination.`
    );
    process.exit(0);
  });
}
