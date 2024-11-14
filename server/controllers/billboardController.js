import { db } from '../db/db.js'

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