import {db} from '../db/db.js';

const songs = [
  {
    _id:'song1',
    date:'2014-03-08',
    rank:'1',
    song:'Happy',
    artist:'Parrell Williams',
    weeks_on_board:'8'

  }
];
(async () => {
  try {
    // TODO replace cluster0 with your db name
    await db.connect('cluster0', 'songs');
    const num = await db.createMany(songs);
    console.log(`Inserted ${num.insertedCount} songs`);
  } catch (e) {
    console.error('could not seed');
    console.dir(e);
  } finally {
    if (db) {
      db.close();
    }
    process.exit();
  }
})();