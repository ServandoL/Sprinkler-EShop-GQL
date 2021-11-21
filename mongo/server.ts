import mongoose from "mongoose";

const uri = `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.faqfr.mongodb.net/${process.env.mongoDatabase}`;

main().catch((err) => console.log(err));

async function main() {
  mongoose
    .connect(uri)
    .then(() => console.log("Mongo server is up and running."))
    .catch(() => console.log("Error while connecting to MongoDB"));
}
