/* eslint-disable no-console */
import {db} from '../db/db.js';
import * as fetch from '../data/data-fetch.mjs';

const songs = await (async () => {
  const spotifyData = await fetch.getMappedSpotifyData();
  const billboardData = await fetch.getMappedBillBoardData(spotifyData);
  const songs =  await fetch.consolidateBillboardAndSpotify(spotifyData, billboardData);

  return songs.map( (song, index) => {
    song._id = index;
    return song;
  });
})();


(async () => {
  try {
    await db.connect('OnTheRecordDB', 'songs');
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