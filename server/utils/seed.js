import {db} from '../db/db.js';

const songs = [
  
  {_id:'song1',
    artist:'Kendrick Lamar',
    title:'Humble',
    year:'2017',
    weeks_on_board:'37',
    stream:'2295429735',
    genre:'Hip-Hop/Rap'
  },
  {_id:'song3',
    artist:'Lil Pump',
    title:'Gucci Gang',
    year:'2017',
    weeks_on_board:'1',
    stream:'20000',
    genre:'Hip-Hop/Rap'
  },
  {_id:'song2',
    artist:'Kendrick Lamar',
    title:'Swimming Pools (Drank)',
    year:'2013',
    weeks_on_board:'11',
    stream:'764385899',
    genre:'Hip-Hop/Rap'
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