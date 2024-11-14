import { db } from '../db/db.js'

export async function getMostStreamedGenresByYear(req, res, next){
  const year = parseInt(req.params.year);
  try {
    const list = await db.getTopGenresByYear(year);
    if (list.length === 0) {
      return res.status(404).json({ message: 'No data found for this year' });
    }
    res.json({data : list});
  } catch(error){
    console.dir(error);
    res.status(500).json({message: `Failed to retrieve genre of ${year}`});
  }
}