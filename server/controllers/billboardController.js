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

export async function getTopBillBoardSongs(req, res){
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
}