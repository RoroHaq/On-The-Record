/* eslint-disable no-console */
import express from 'express';
import { db }   from '../db/db.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi  from 'swagger-ui-express';
import * as Genre from '../controllers/genreController.js'
import * as BillBoard from '../controllers/billboardController.js'
import * as Streams from '../controllers/streamsController.js'

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
router.get('/genre/all/:year', Genre.getGenresByYear);


router.use('/genre/:genre', Genre.validateGenreQueryParam);
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
router.get('/genre/:genre', Genre.getSpecifiedGenre);


router.use('/billboard', BillBoard.validateBillboardQueryParam)
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
router.get('/billboard', BillBoard.getTopBillBoardSongs);

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
router.get('/streams/top/:year', Streams.getMostStreamedGenresByYear);
export default router;

