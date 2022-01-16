import { ApolloServer } from "apollo-server";
import { resolvers } from "./apollo/data-access/resolvers";
import { typeDefs } from "./apollo/data-access/schema";
import { MongoServer } from "./apollo/server/mongo/server";

const productsCollection = process.env.productsCollection;
const usersCollection = process.env.usersCollection;

const dataSources = () => ({
  productsApi: new MongoServer(productsCollection),
  usersApi: new MongoServer(usersCollection)
})

const port = process.env.port || 4000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  introspection: true
});

server.listen({ port: port }).then(({ url }) => {
  console.log(`Apollo server running on ${url}`);
}).catch((error: Error) => {
  console.log("Sprinkler E-Shop", JSON.stringify({error: error}))
});
