import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./apollo/datasource/data-access/resolvers";
import { typeDefs } from "./apollo/datasource/data-access/schema";
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.port || 4000;
const uri = `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.faqfr.mongodb.net/${process.env.mongoDatabase}`;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

main().catch((err) => console.log(err));

async function main() {
  mongoose
    .connect(uri)
    .then(async () => {
      await server.start();
      server.applyMiddleware({ app });

      app.listen({ port: port }, () => {
        console.log(`Apollo server is running on http://localhost:${port}`);
      });
      console.log("Mongo server is up and running.");
    })
    .catch(() => console.log("Error while connecting to MongoDB"));
}
