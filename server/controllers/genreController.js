import { db }   from '../db/db.js';

/**
 * This middlewear does the user request when accessing the endpoint
 * /api/genre/all/:year. It returns an object with a list of Genres and their data from
 * the specified year. Otherwise it sends an error.
 * 
 * @param {Object} req The User's request (Query Params/Inputs)
 * @param {Object} res The Response of the Middleware
 * @param {Function} next Use to call the next succeeding Middleware after this 
 */
export async function getEveryGenreByYear(req, res, next){
  try{
    const year = parseInt(req.params.year, 10);
    const genres = await db.getAllGenreByYear(year);
    if (genres.length === 0) {
      const error = new Error(`No data found for ${year}`);
      error.status = 404;
      throw error;
    }
    res.json({data: genres});
  } catch (error){
    if(error.status === undefined){
      error.message = 'Failed to retrieve genres';
    }
    next(error)
  }
}

/**
 * This middlewear validates the Query Parameters given to the endpoint
 * /api/genre/:genre. If no query params is given, or its the correct one. It will 
 * go next to the other middlewear function to process it. 
 * Otherwise it will send the user an Error.
 * 
 * @param {Object} req The User's request (Query Params/Inputs)
 * @param {Object} res The Response of the Middleware
 * @param {Function} next Use to call the next succeeding Middleware after this
 */
export function validateGenreQueryParam(req, res, next){
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
 * This middlewear will be called after validateGenreQueryParam,
 * it then process the user's request after the validation and sends
 * the user a Json object that includes an array of a list of data of a Genre
 * through the years or at a specific year. If found nothing it sends an Error.
 * 
 * @param {Object} req The User's request (Query Params/Inputs)
 * @param {Object} res The Response of the Middleware
 * @param {Function} next Use to call the next succeeding Middleware after this
 */
export async function getSpecifiedGenre(req, res, next){
  try{
    let genre = req.params.genre;
    genre = genre.trim().toLowerCase().replace(/_/g, '/');
    const year = parseInt(req.query.year, 10);
    const genres = year 
      ? await db.getGenreByYear(genre, year) 
      : await db.getGenre(genre);

    if (genres.length === 0) {
      const error = new Error('No data found for the specified genre');
      error.status = 404;
      throw error;
    }
    res.json({data: genres});
  } catch (error){
    if(error.status === undefined){
      error.message = 'Failed to retrieve genres';
    }
    next(error);
  }
}