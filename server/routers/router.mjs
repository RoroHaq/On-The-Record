/* eslint-disable no-console */
import express from 'express';
import { db }   from '../db/db.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi  from 'swagger-ui-express';

const router = express.Router();
const options = {
  swaggerDefinition:{
    info:{
      title:' On the Record API',
      version: '1.0.0'
    }
  },
  apis: ['./server/routers/router.mjs']
};
router.use(express.static('../../client/dist'));
const swaggerDocs = swaggerJsDoc(options);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * Test to see if the server is online and receiving request
 * 
 * @route GET /api/alive
 * @returns {string} - A JSON message with the status of the server
 * @swagger
 * /api/alive:
 *   get:
 *     summary: Check if the server is alive
 *     description: Returns a JSON message with the status of the server
 *     responses:
 *       200:
 *         description: Server is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alive:
 *                   type: boolean
 *                   example: true
 */
router.get('/alive', (req, res) => {
  res.json({ alive: true });
});

//router.use('/genre/:genre', validateGenre);

/**
 * Retrieves all genres data and aggregates total streams and weekly placements for a single year.
 * @route GET /api/genre/all/:year
 * @param {int} req.params.year - The year to look for
 * @returns {object} - return a JSON Object of the data of a specific year
 *  or an error message if not found.
 * @swagger
 * /api/genre/all/{year}:
 *   get:
 *     summary: Get data for all genres in a year
 *     description: Fetches data for all genres, filtered by year.
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         description: Year to search for
 *         schema:
 *           type: int
 *     responses:
 *       200:
 *         description: Data for the all genres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No data found for the year
 *       500:
 *         description: Failed to retrieve genres
 */
router.get('/genre/all/:year', async (req, res) => {
  try{
    const year = parseInt(req.params.year, 10);
    const genres = await db.getAllGenreByYear(year);
    if (genres.length === 0) {
      return res.status(404).json({ message: `No data found for ${year}` });
    }
    res.json({data: genres});
  } catch (error){
    console.dir(error);
    res.status(500).json({message: 'Failed to retrieve genres'});
  }
});

/**
 * Get the data of a specific genre
 * @route GET /api/genre/:genre
 * @param {string} req.params.genre - The genre to look for
 * @returns {object} - return a JSON Object of the data of a specific genre
 *  or an error message if not found.
 * @swagger
 * /api/genre/{genre}:
 *   get:
 *     summary: Get data for a specific genre
 *     description: Fetches data for a specific genre, optionally filtered by year.
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         description: Genre to search for
 *         schema:
 *           type: string
 *       - in: query
 *         name: year
 *         required: false
 *         description: Year to filter results by
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data for the specified genre
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No data found for the specified genre
 *       500:
 *         description: Error retrieving data
 */

function validateGenreQueryParam(req, res, next){
  try{
    if(Object.keys(req.query).length > 0 && !req.query.year){
      const error = new Error('Invalid Query Param Found');
      error.status = 404;
      throw error;
    }
    next();
  }catch(Error){
    next(Error);
  }
}

router.use('/genre/:genre', validateGenreQueryParam);

router.get('/genre/:genre', async (req, res, next) => {
  try{
    let genre = req.params.genre;
    if(req.query.length > 0 && !req.query.year){
      const error = new Error('Invalid Query Param Found');
      error.status = 404;
      throw error;
    }
    genre = genre.trim().toLowerCase().replace(/_/g, '/');
    const year = parseInt(req.query.year, 10);
    const genres = year 
      ? await db.getGenreByYear(genre, year) 
      : await db.getGenre(genre);

    if (genres.length === 0) {
      const error = new Error('No data found for the specified genre');
      error.status = 404;
      throw error;
      // return res.status(404).json({ message: 'No data found for the specified genre' });
    }
    res.json({data: genres});
  } catch (error){
    if(error.status === undefined){
      error.message = 'Failed to retrieve genres';
    }
    next(error);
    // res.status(500).json({message: 'Failed to retrieve genres'});
  }
});

/**
 * Get the top 100 of the billboard for a single year
 * 
 * @route GET /api/billboard
 * @param {string} [req.query.year] - Optional query parameter to filter out the year 
 * @returns {object} - return a JSON Object list of songs and their
 * genres that were on the billboard top 100 for each year.
 *  or an error message if not found.
 * @swagger
 * /api/billboard
 *   get:
 *     summary: Get Billboard top 100 songs
 *     description: Fetches top 100 songs from the Billboard chart for a specific year or all time.
 *     parameters:
 *       - in: path
 *         name: year
 *         required: false
 *         description: Year to filter
 *         schema:
 *           type: string
 *       - in: query
 *     responses:
 *       200:
 *         description: List of songs on the billboard chart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No data found
 *       500:
 *         description: Failed to retrieve songs
 
 */

router.get('/billboard', async (req, res) => {
  const year = parseInt(req.query.year, 10);
  try{
    const list = year 
      ? await db.getBillBoardSongsByYear( year) 
      : await db.getBillBoardSongs();
    
    if (list.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    res.json({data: list});
  } catch (error){
    console.dir(error);
    res.status(500).json({message: 'Failed to retrieve songs'});
  }
});

/**
 * Get a list of random songs
 * @route GET /api/random/:number
 * @param {number} req.params.number - The number of random songs to retrieve
 * @returns {array} - A list of random songs
 * @swagger
 * /api/random/{number}:
 *   get:
 *     summary: Get a list of random songs
 *     description: Fetch a specified number of random songs.
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         description: Number of random songs to fetch
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of random songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error retrieving random songs
 */
router.get('/random/:number', async (req, res) => {
  const quantity = parseInt(req.params.number);
  try {
    const songs = await db.getRandom(quantity);
    res.json(songs);
  } catch (error) {
    console.dir(error);
    res.status(500).json({ message: 'Failed to retrieve songs' });
  }
  res.json;
});
/**
 * Get a ranked list genres based on how many streams songs under
 * that genre released in a given year add up to.
 * 
 * @route GET /api/streams/top/:year
 * @param {string} req.params.year - The year to look for 
 * @returns {object} - A JSON object representing a ranked list genres based on how many 
 * streams songs under that genre released in a given year add up to.
 *  or an error message if not found.
 * @swagger
 * /api/streams/top/{year}:
 *   get:
 *     summary: Get ranked genres based on streams for a year
 *     description: Fetches a list of genres ranked by the number of streams in a given year.
 *     parameters:
 *       - in: path
 *         name: year
 *         required: true
 *         description: Year to filter results by
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ranked list of genres by stream counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No data found for the specified year
 *       500:
 *         description: Error retrieving stream data
 */
router.get('/streams/top/:year', async (req, res) => {
  const year = parseInt(req.params.year);
  try {
    const list = await db.getTopGenresByYear(year);
    if (list.length === 0) {
      return res.status(404).json({ message: 'No data found for this year' });
    }
    res.json({data : list});
  } catch(error){
    console.dir(error);
    res.status(500).json({message: `Failed to retrieve genre of ${year}`});
  }
});
export default router;

