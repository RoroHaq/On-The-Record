import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const dbUrl = process.env.ATLAS_URI;
let instance = null;
class DB{
  constructor(){
    //instance is the singleton, defined in outer scope
    if (!instance){
      instance = this;
      this.db = null;
      this.collection = null;
    }
    return instance;
  }
  /**
   * Connects to the MongoDB database
   * @async
   * @param {string} dbname - The name of the database to connect to.
   * @param {string} collName - The name of the collection to use.
   * @returns {Promise<void>} Resolves once connection is successful.
   */
  async connect(dbname, collName) {
    if (instance.db){
      return;
    }
    if(!this.mongoClient){
      this.mongoClient = new MongoClient(dbUrl, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
    }  
    await instance.mongoClient.connect();
    instance.db = await instance.mongoClient.db(dbname);
    await instance.mongoClient.db(dbname).command({ ping: 1 });
    // eslint-disable-next-line no-console
    console.log('Successfully connected to MongoDB database ' + dbname);
    instance.collection = await instance.db.collection(collName);
  }
  /**
   * Closes the MongoDB connection.
   * @async
   * @returns {Promise<void>} Resolves once the connection is closed.
   */
  async close() {
    await instance.mongoClient.close();
    instance = null;
  }
  /**
   * Retrieves all songs from the db.
   * @async
   * @returns {Promise<Object[]>} Array of songs from the db.
   */
  async readAll() {
    return await instance.collection.find().toArray();
  }
  /**
   * Retrieves genre data and aggregates total streams and weekly placements.
   * @async
   * @param {string} genre - The genre to match in the collection.
   * @returns {Promise<Object[]>} Array of objects with genre, year, 
   * total streams, and weekly placements.
   */
  async getGenre(genre){
    return await instance.collection.aggregate([
      //  Match only documents with the specified genre
      {  $match: { genre: { $regex: `^${genre}$`, $options: 'i' } } },
  
      // group by year and calculate totalStreams and totalWeeklyPlacement
      {
        $group: {
          _id: { year: '$year', genre: '$genre' },
          totalStreams: { $sum: { $toLong: '$streams' } },
          totalWeeklyPlacement: { $sum: { $toInt: '$weeksOnBoard' } }
        }
      },
  
      // the number here means include it,1 is yes 0 is no
      {
        $project: {
          _id: 0,
          genre: '$_id.genre',
          year: '$_id.year',
          totalStreams: 1,
          totalWeeklyPlacement: 1
        }
      },
  
      // Sort, -1 here means descending
      { $sort: { year: -1 } }
    ]).toArray();
  }
  /**
   * Retrieves all genres data and aggregates total streams and weekly placements for a single year.
   * @async
   * @param {int} year - The year to find.
   * @returns {Promise<Object[]>} Array of objects with genre, totalWeeklyPlacement, 
   * total streams.
   */
  async getAllGenreByYear(year){
    return await instance.collection.aggregate([
      { $match: {year: year}},
      {
        $group: {
          _id: { genre: '$genre'},
          totalStreams: { $sum: { $toLong: '$streams' } },
          totalWeeklyPlacement: { $sum: { $toInt: '$weeksOnBoard' } }
        }
      },
      {
        $project: {
          _id: 0,
          genre: '$_id.genre',
          totalStreams: 1,
          totalWeeklyPlacement: 1
        }
      },
      { $sort: { totalStreams: -1 } }
    ]).toArray();
  }

  /**
   * Retrieves genre data for a specific year, aggregating total streams and weekly placements.
   * @async
   * @param {string} genre - The genre to match in the collection.
   * @param {number} year - The year to match in the collection.
   * @returns {Promise<Object[]>} Array of objects with genre, year,
   *  total streams, and weekly placements.
   */
  async getGenreByYear(genre, year){
    return await instance.collection.aggregate([
      
      {  $match: { genre: { $regex: `^${genre}$`, $options: 'i'}, year: year }   },
      {
        $group: {
          _id: { year: '$year', genre: '$genre' },
          totalStreams: { $sum: { $toLong: '$streams' } },
          totalWeeklyPlacement: { $sum: { $toInt: '$weeksOnBoard' } }
        }
      },
      {
        $project: {
          _id: 0,
          genre: '$_id.genre',
          year: '$_id.year',
          totalStreams: 1,
          totalWeeklyPlacement: 1
        }
      }
    ]).toArray();
  }
  async getBillBoardSongs(){
    const result = await instance.collection.aggregate([
      { $group: {
        _id: '$year', 
        songs: {
          $push: 
          { 
            artist: '$artist',
            title: '$title',
            weeksOnBoard: '$weeksOnBoard',
            streams: '$streams',
            genre: '$genre'
          }
        } 
      }
      },
      { $sort: { _id: -1 } }, 
      
      { 
        $addFields: { year: '$_id' }  
      },
      
      { 
        $project: {
          _id: 0,
          year:1,     
          songs: 1       
        }
      }

    ]).toArray();
    return result.map(doc => ({
      year: doc.year,
      songs: doc.songs
    }));
  }
  async getBillBoardSongsByYear(year){
    const result = await instance.collection.aggregate([
      { $match: { year: year }},
      { 
        $group: {
          _id: '$year',
          songs: {
            $push: {
              artist: '$artist',
              title: '$title',
              weeksOnBoard: '$weeksOnBoard',
              streams: '$streams',
              genre: '$genre'
            }
          }
        }
      },
      { 
        $addFields: { year: '$_id' }  
      },
      {
        $project: {
          _id: 0,
          year: 1,
          songs: 1
        }
      }
    ]).toArray();
    return result.map(doc => ({
      year: doc.year,
      songs: doc.songs
    }));
  }
  /**
   * Retrieves the top genres for a specific year, ranked by total streams.
   * @async
   * @param {number} year - The year to retrieve the top genres for.
   * @returns {Promise<Object[]>} Array of songs with rank, genre, and total streams.
   */

  async getTopGenresByYear(year) {
    const result = await instance.collection.aggregate([
      { $match: { year: year } },
      {
        $group: {
          _id: '$genre',
          totalStreams: { $sum: { $toLong: '$streams' } }
        }
      },
  
      // sort streams in descending order
      { $sort: { totalStreams: -1 } },
  
      // add rank 
      {
        $group: {
          _id: null,
          genres: {
            $push: {
              genre: '$_id',
              totalStreams: '$totalStreams'
            }
          }
        }
      },
  
      // Unwind the genres array to rank them
      { $unwind: '$genres' },
      {
        $group: {
          _id: null,
          list: {
            $push: {
              genre: '$genres.genre',
              totalStreams: '$genres.totalStreams'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          list: {
            $map: {
              input: { $range: [0, { $size: '$list' }] }, 
              as: 'index',
              in: {
                rank: { $add: ['$$index', 1] }, 
                genre: { $arrayElemAt: ['$list.genre', '$$index'] },
                totalStreams: { $arrayElemAt: ['$list.totalStreams', '$$index'] } 
              }
            }
          }
        }
      }
     
    ]).toArray();
    return result[0].list;
  }
  /**
   * Retrieves a random sample of songs from the collection.
   * @async
   * @param {number} number - The number of random songs to retrieve.
   * @returns {Promise<Object[]>} Array of randomly selected songs.
   */
  async getRandom(number) {
    return await instance.collection.aggregate([{ $sample: { size: number } }]).toArray();
  }
  /**
   * Inserts a single song into the collection.
   * @async
   * @param {Object} song - The song to insert.
   * @returns {Promise<Object>} The result of the insertion operation.
   */
  async create(song) {
    return await instance.collection.insertOne(song);
  }
  /**
   * Inserts multiple songs into the collection.
   * @async
   * @param {Object[]} songs - The songs to insert.
   * @returns {Promise<Object>} The result of the bulk insertion operation.
   */
  async createMany(songs){
    return await instance.collection.insertMany(songs);
  }
  /**
   * Opens a connection to the MongoDB database and closes it after completion.
   * @async
   * @param {string} dbname - The name of the database to connect to.
   * @param {string} collName - The name of the collection to use.
   * @returns {Promise<void>} Resolves once the connection is closed.
   */
  async open(dbname, collName) {
    try {
      await instance.connect(dbname, collName);
    } finally {
      await instance.close();
    }
  }
}

export const db = new DB();