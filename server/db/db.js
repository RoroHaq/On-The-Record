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
  async getGenre(genre){
    return await instance.collection.aggregate([
      //  Match only documents with the specified genre
      {  $match: { genre: { $regex: `^${genre}$`, $options: 'i' } } },
  
      // Group by year and calculate totalStreams and TotalWeeklyPlacement
      {
        $group: {
          _id: { year: "$year", genre: "$genre" },
          totalStreams: { $sum: { $toLong: "$stream" } },
          TotalWeeklyPlacement: { $sum: { $toInt: "$weeks_on_board" } }
        }
      },
  
      // Reshape the output document
      {
        $project: {
          _id: 0,
          genre: "$_id.genre",
          year: "$_id.year",
          totalStreams: 1,
          TotalWeeklyPlacement: 1
        }
      },
  
      // Sort
      { $sort: { year: 1 } }
    ]).toArray();
  }
  async getGenreByYear(genre, year){
    return await instance.collection.aggregate([
      
      {  $match: { genre: { $regex: `^${genre}$`, $options: 'i'}, year: year }   },
      {
        $group: {
          _id: { year: "$year", genre: "$genre" },
          totalStreams: { $sum: { $toLong: "$stream" } },
          TotalWeeklyPlacement: { $sum: { $toInt: "$weeks_on_board" } }
        }
      },
      {
        $project: {
          _id: 0,
          genre: "$_id.genre",
          year: "$_id.year",
          totalStreams: 1,
          TotalWeeklyPlacement: 1
        }
      }]).toArray();
  }
  async getBillBoardSongs(){

  }
  async getBillBoardSongsByYear(){

  }
  async getTopGenresByYear(){

  }
  async getRandom(number) {
    return await instance.collection.aggregate([{ $sample: { size: number } }]).toArray();
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