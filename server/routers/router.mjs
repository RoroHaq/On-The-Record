import express from 'express';
import { db }   from '../db/db.js';
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

function validateGenre(req, res, next){
  let genre = req.params.genre
  if (!genre) {
    return res.status(400).json({ message: 'Genre is required'});
  }
  genre = genre.trim().toLowerCase().replace(/_/g, '/')
  next()
}

router.use('/genre/:genre', validateGenre)

/**
 * Get the data of a specific genre
 * @route GET /api/genre/:genre
 * @param {string} req.params.genre - The genre to look for
 * @returns {object} - return a JSON Object of the data of a specific genre
 *  or an error message if not found.
 */
router.get('/genre/:genre', async (req, res) => {
  try{
    let genre = req.params.genre
    genre = genre.trim().toLowerCase().replace(/_/g, '/');
    const year = req.query.year;
    const genres = year 
    ? await db.getGenreByYear(genre, year) 
    : await db.getGenre(genre);

    if (genres.length === 0) {
      return res.status(404).json({ message: 'No data found for the specified genre' });
    }
    res.json({data: genres});
  } catch (error){
    console.dir(error);
    res.status(500).json({message: 'Failed to retireve genres'});
  }
})

/**
 * Get the top 100 of the billboard for a single year
 * 
 * @route GET /api/billboard
 * @param {string} [req.query.year] - Optional query parameter to filter out the year 
 * @returns {object} - return a JSON Object list of songs and their genres that were on the billboard top 100 for each year.
 *  or an error message if not found.
 */
router.get('/billboard/', async (req, res) => {
  const year = req.query.year;
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
    res.status(500).json({message: 'Failed to retireve songs'});
  }
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
router.get('/streams/top/:year', async (req, res) => {
  const year = req.params.year;
  try {
    const list = await db.getTopGenresByYear(year);
    if (list.length === 0) {
      return res.status(404).json({ message: 'No data found for this year' });
    }
    res.json(list);
  } catch( error){
    console.dir(error);
    res.status(500).json({message: `Failed to retireve genre of ${year}`});
  }
})
export default router;

