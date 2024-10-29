import 'dotenv/config'
import { MongoClient, ServerApiVersion } from 'mongodb';

const dbUrl = process.env.ATLAS_URI;
let instance = null
class DB{
  constructor(){
    //instance is the singleton, defined in outer scope
      if (!instance){
        instance = this;
        this.mongoClient = new MongoClient(dbUrl, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
        })
        this.db = null;
        this.collection = null;
      }
    return instance;
  }
  async connect(dbname, collName) {
    if (instance.db){
      return;
    }
    await instance.mongoClient.connect();
    instance.db = await instance.mongoClient.db(dbname);
    await instance.mongoClient.db(dbname).command({ ping: 1 });
    console.log('Successfully connected to MongoDB database ' + dbname);
    instance.collection = await instance.db.collection(collName);
  }
  async close() {
    await instance.mongoClient.close();
    instance = null;
  }
  async readAll() {
    return await instance.collection.find().toArray();
  }
  async create(song) {

    return await instance.collection.insertOne(song);
  }
  async createMany(songs){
    return await instance.collection.insertMany(songs)
  }
  async open(dbname, collName) {
    try {
      await instance.connect(dbname, collName);
    } finally {
      await instance.close();
    }
  }
}
export const db = new DB();