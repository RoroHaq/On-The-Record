import { db } from '../db/db.js';

/**
 * This middlewear process the user request when putting the 
 * /api/streams/top/:year as it sends the user an object which includes a list
 * of songs from the specified year. Otherwise it will throw an Error.
 * 
 * @param {Object} req The User's request (Query Params/Inputs)
 * @param {Object} res The Response of the Middleware
 * @param {Function} next Use to call the next succeeding Middleware after this
 */
export async function getMostStreamedGenresByYear(req, res, next){
  const year = parseInt(req.params.year);
  try {
    const list = await db.getTopGenresByYear(year);
    if (list.length === 0) {
      const error = new Error('No data found for this year');
      error.status = 404;
      throw error;
    }
    res.set('Cache-Control', 'public, max-age=604800'); 
    res.json({data : list});
  } catch(error){
    if(error.status === undefined){
      error.message = `Failed to retrieve genre of ${year}`;
    }
    next(error);
  }
}