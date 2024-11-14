import { db } from '../db/db.js'

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
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
    res.json({data : list});
  } catch(error){
    if(error.status === undefined){
      error.message = `Failed to retrieve genre of ${year}`
    }
    next(error);
  }
}