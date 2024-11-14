import { db } from '../db/db.js'

/**
 * This function is used to validate the Query param given in the endpoint
 * /api/billboard, if its valid or a query param is not given, it will go to the next function 
 * to process it, otherwise it goes to the error handling middlewear to respond with an Error.
 * 
 * @param {Object} req The User's request (Query Params/Inputs)
 * @param {Object} res The Response of the Middleware
 * @param {Function} next Use to call the next succeeding Middleware after this
 */
export function validateBillboardQueryParam(req, res, next){
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

/**
 * This will go through the request and respond with a json representation
 * of the data, which is a list of top 100 songs on the billboard of a certain year or all years.
 * 
 * @param {Object} req The User's request (Query Params/Inputs)
 * @param {Object} res The Response of the Middleware
 * @param {Function} next Use to call the next succeeding Middleware after this
 */
export async function getTopBillBoardSongs(req, res, next){
  const year = parseInt(req.query.year, 10);
  try{
    const list = year 
      ? await db.getBillBoardSongsByYear( year) 
      : await db.getBillBoardSongs();
    
    if (list.length === 0) {
      const error = new Error('No data found');
      error.status = 404;
      throw error
    }
    res.json({data: list});
  } catch (error){
    if(error.status === undefined){
      error.message = 'Failed to retrieve songs'
    }
    next(error)
  }
}