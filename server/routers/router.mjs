import express from 'express';
import { db }  from '../db/db.js';
const router = express.Router();
const port = 3000;

router.use(express.static('../../client/dist'));

/**
 * Test to see if the server is online and receiving request
 * 
 * @route GET /api/alive
 * @returns {string} - A JSON message with the status of the server
 */
router.get('/alive', (req, res) => {
  res.json({ alive: true });
});

/**
 * Get the data of a specific genre
 * @route GET /api/genre/:genre
 * @param {string} req.params.genre - The genre to look for
 * @returns {object} - return a JSON Object of the data of a specific genre
 *  or an error message if not found.
 */
router.get('/genre/:genre', (req, res) => {
  // TODO
})

/**
 * Get the top 100 of the billboard for a single year
 * 
 * @route GET /api/billboard
 * @param {string} [req.query.year] - Optional query parameter to filter out the year 
 * @returns {object} - return a JSON Object list of songs and their genres that were on the billboard top 100 for each year.
 *  or an error message if not found.
 */
router.get('/billboard/', (req, res) => {
  // TODO
})

router.get('/random/:number', async (req, res) => {
  const quantity = parseInt(req.params.number);
  try {
    const songs = await db.getRandom(quantity);
    res.json(songs);
  } catch (error) {
    console.dir(error);
    res.status(500).json({ message: 'Failed to retrieve songs' });
  }
  res.json
})
/**
 * Get a ranked list genres based on how many streams songs under that genre released in a given year add up to.
 * 
 * @route GET /api/streams/top/:year
 * @param {string} req.params.year - The year to look for 
 * @returns {object} - A JSON object representing a ranked list genres based on how many 
 * streams songs under that genre released in a given year add up to.
 *  or an error message if not found.
 */
router.get('/streams/top/:year', (req, res) => {
  // TODO 
  
})
export default router;

