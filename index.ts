import { ApolloServer } from 'apollo-server';
import { MongoClient } from 'mongodb';
import * as env from './config';
import { CartDatasource } from './src/apollo/cart-data-access/datasource';
import { OrderResolvers } from './src/apollo/cart-data-access/resolvers';
import { OrderTypeDefs } from './src/apollo/cart-data-access/schema';

const client: MongoClient = new MongoClient(env.connectionString);

async function main() {
  const port = env.port;
  const mongoClient = await client.connect();
  if (mongoClient) {
    const datasources = () => ({
      cartApi: new CartDatasource(mongoClient),
    });
    const server = new ApolloServer({
      typeDefs: [OrderTypeDefs],
      resolvers: [OrderResolvers],
      dataSources: datasources,
      introspection: true,
    });

    server.listen({ port: port }).then(({ url }) => {
      console.log(`index:`, `Apollo server listening on ${url}`);
    });
  } else {
    console.log('index', 'There was an error connecting to Mongo.');
  }
}

main().catch((error) => {
  console.log(
    `index:`,
    `An error occurred while creating connections. ${JSON.stringify({
      ...error,
    })}`
  );
});

process.on('SIGINT', gracefulDisconnect).on('SIGTERM', gracefulDisconnect);

function gracefulDisconnect() {
  client.close(() => {
    console.log(`Mongo connection was disconnected through app termination.`);
    process.exit(0);
  });
}
