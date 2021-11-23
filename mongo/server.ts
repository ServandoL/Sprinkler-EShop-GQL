import { DataSource } from "apollo-datasource";
import _ from "lodash";
import { MongoClient } from "mongodb";

const uri = `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.faqfr.mongodb.net/${process.env.mongoDatabase}`;
const client = new MongoClient(uri, { monitorCommands: true });
const dbName = process.env.mongoDatabase;

export class MongoServer extends DataSource {
  collection!: any;
  data!: any;
  database!: any;

  constructor(collectionName: string | undefined) {
    super();
    this.collection = collectionName;
  }

  async start() {
    await client.connect();
    this.database = client.db(dbName);
    this.data = this.database.collection(this.collection)
    console.log(`Connected successfully to MongoDB: ${dbName}`);
    client.on("commandStarted", (event) => console.debug(event));
    client.on("commandSucceeded", (event) => console.debug(event));
    client.on("commandFailed", (event) => console.debug(event));
  }

  async stop() {
    client.close();
  }

  async getAll(args: any) {
    const data = await this.data.find({}).toArray();
    return _.filter(data, args)
  }

  async getOneById(id: any) {
    try {
      const query = { _id: id };
      return await this.data.find(query);
    } catch (err) {
      console.log(`Error occured while inserting: ${err}`);
    }
  }

  async addOne(obj: any) {
    try {
      const result = await this.data.insertOne(obj);
      console.log(`Document inserted ${JSON.stringify(result)}`);
    } catch (err) {
      console.log(`Error occured while inserting: ${err}`);
    }
  }
}


