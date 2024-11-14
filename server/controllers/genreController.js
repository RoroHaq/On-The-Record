import { db }   from '../db/db.js';


export async function getGenresByYear(req, res){
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
}

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

export async function getSpecifiedGenre(req, res, next){
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
    }
    res.json({data: genres});
  } catch (error){
    if(error.status === undefined){
      error.message = 'Failed to retrieve genres';
    }
    next(error);
  }
}