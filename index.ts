import { ApolloServer } from "apollo-server";
import { resolvers } from "./apollo/datasource/data-access/resolvers";
import { typeDefs } from "./apollo/datasource/data-access/schema";

const port = process.env.port || 4000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen({ port: port }).then(({ url }) => {
  console.log(`Apollo server running on ${url}`);
});
