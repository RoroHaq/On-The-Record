#!/usr/bin/env node
import app from '../app.js';
import { db } from '../db/db.js';
const port = process.env.PORT || 3000;



(async () => {
  try {
	  console.log("hi!");
    await db.connect('OnTheRecordDB', 'songs');
	  console.log("bye!");
  } catch (e) {
    console.error('could not connect');
    // eslint-disable-next-line no-console
    console.dir(e);
    process.exit();
  }
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}!`);
  });
})();
