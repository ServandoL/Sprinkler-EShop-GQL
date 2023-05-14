import { MongoClient } from 'mongodb';
import * as env from './config';
import { CartDatasource } from './src/apollo/cart-data-access/datasource';
import { CartResolvers } from './src/apollo/cart-data-access/resolvers';
import { CartTypeDefs } from './src/apollo/cart-data-access/schema';
import { OrderDatasource } from './src/apollo/order-data-access/datasource';
import { OrderResolvers } from './src/apollo/order-data-access/resolvers';
import { OrderTypeDefs } from './src/apollo/order-data-access/schema';
import { ProductDatasource } from './src/apollo/products-data-access/datasource';
import { ProductResolvers } from './src/apollo/products-data-access/resolvers';
import { ProductsTypeDef } from './src/apollo/products-data-access/schema';
import { UserDatasource } from './src/apollo/users-data-access/datasource';
import { UserResolvers } from './src/apollo/users-data-access/resolvers';
import { UserTypeDefs } from './src/apollo/users-data-access/schema';
import { AppContext } from './src/interfaces/interfaces';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServer, ApolloServerOptions } from '@apollo/server';

const client: MongoClient = new MongoClient(env.connectionString);

async function main() {
  try {
    await client.connect();
    const config: ApolloServerOptions<AppContext> = {
      typeDefs: [OrderTypeDefs, ProductsTypeDef, CartTypeDefs, UserTypeDefs],
      resolvers: [OrderResolvers, ProductResolvers, CartResolvers, UserResolvers],
      introspection: env.introspection === 'true',
    };
    const server = new ApolloServer(config);
    const { url } = await startStandaloneServer<AppContext>(server, {
      context: async () => {
        const dataSources = {
          orderApi: new OrderDatasource(client),
          productApi: new ProductDatasource(client),
          cartApi: new CartDatasource(client),
          userApi: new UserDatasource(client),
        };
        return {
          dataSources,
        };
      },
      listen: { port: +env.port },
    });
    console.log('index', `Apollo Server listening on ${url}`);
  } catch (error) {
    console.log('index', `There was an error connecting to Mongo: ${JSON.stringify(error)}`);
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
