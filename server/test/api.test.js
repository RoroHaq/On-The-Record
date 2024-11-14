/* eslint-disable no-undef */
import * as chai from 'chai';
import request from 'supertest';
import app from '../app.js';
import sinon from 'sinon';
import { db }  from '../db/db.js';
import chaiAsPromised from  'chai-as-promised';

chai.use(chaiAsPromised);

const stubDbGetGenre = sinon.stub(db, 'getGenre');
const stubDbGetGenreByYear = sinon.stub(db, 'getGenreByYear');
const stubDbgetAllGenreByYear = sinon.stub(db, 'getAllGenreByYear');
const stubDbGetBillBoardSongs = sinon.stub(db, 'getBillBoardSongs');
const stubDbGetBillBoardsongsByYear = sinon.stub(db, 'getBillBoardSongsByYear');
const stubDbGetTopGenresByYear = sinon.stub(db, 'getTopGenresByYear');

const expect = chai.expect;

/**
 * Genre Fetching Object Example:
 * body = {data: [
 *      {
 *        genre: Pop, 
 *        year: 2017,
 *        totalStreams: 100000
 *        totalBillBoardPlacements: 49
 *       },
 *      ....Object
 *      ]
 * }
 * 
 * Fetch specific year of Genre, ex 2019
 * 
 * body = {data: [
 *       {
 *        genre: Pop, 
 *        year: 2019,
 *        totalStreams: 100000
 *        totalBillBoardPlacements: 49
 *       }]
 *    }
 *  NOTE: INDEXES WILL CHANGE LATER ON
 */
describe('/api/genre/:genre and ?year=Num Testing', () =>{
  before(() =>{
    stubDbGetGenre.resolves([
      {
        genre: 'Pop',
        year: 2010,
        totalStreams : 450000,
        totalWeeklyPlacement : 120
      },
      {
        genre: 'Pop',
        year: 2011,
        totalStreams : 400000,
        totalWeeklyPlacement : 110
      },
    ]);

    stubDbGetGenreByYear.resolves([
      {
        genre: 'Pop',
        year: 2017,
        totalStreams : 4500000,
        totalWeeklyPlacement : 150
      },
    ]);
  });

  it('Should Return a list of genre info through the years', async () =>{
    const response = await request(app).get('/api/genre/Pop');
   
    const body = response.body;
    expect(body.data.length).to.equal(2);
  });

  it('Should Return the list of genres and match the info from Pop in 2010', async() =>{
    const response = await request(app).get('/api/genre/Pop');
    const body = response.body;

    expect(body.data[0]).to.have.property('genre', 'Pop');
    expect(body.data[0]).to.have.property('year', 2010);
    expect(body.data[0]).to.have.property('totalStreams', 450000);
    expect(body.data[0]).to.have.property('totalWeeklyPlacement', 120);
  });

  it('Should Return the list of genres and match the info from Pop in 2011', async() =>{
    const response = await request(app).get('/api/genre/Pop');
    const body = response.body;

    expect(body.data[1]).to.have.property('genre', 'Pop');
    expect(body.data[1]).to.have.property('year', 2011);
    expect(body.data[1]).to.have.property('totalStreams', 400000);
    expect(body.data[1]).to.have.property('totalWeeklyPlacement', 110);
  });

  it('Should return Pop Object in 2017', async()=>{
    const response = await request(app).get('/api/genre/Pop?year=2017');
    const body = response.body;

    chai.assert.isObject(body, 'body is an object');

    expect(body.data[0]).to.have.property('genre', 'Pop');
    expect(body.data[0]).to.have.property('year', 2017);
    expect(body.data[0]).to.have.property('totalStreams', 4500000);
    expect(body.data[0]).to.have.property('totalWeeklyPlacement', 150);

    expect(response.statusCode).to.equal(200);
  });
});

describe('/api/genre/:genre Error Handling', () =>{
  before(()=>{
    stubDbGetGenre.resolves([]);
    stubDbGetGenreByYear.resolves([]);
  });

  it('Should Return the error Message after invalid genre input', async () =>{
    const response = await request(app).get('/api/genre/HocusPocus');
    const body = response.body;
    expect(body).to.deep.equal({error: 'No data found for the specified genre'});
    expect(response.statusCode).to.equal(404);
  });

  it('Should Return the error Message after invalid query param Input', async () =>{
    const response = await request(app).get('/api/genre/Pop?year=1998');
    const body = response.body;
    expect(body).to.deep.equal({error: 'No data found for the specified genre'});
    expect(response.statusCode).to.equal(404);
  });

  it('Should return all genres if given invalid queryParam name', async()=>{
    const response = await request(app).get('/api/genre/Pop?number=2017');
    const body = response.body;

    chai.assert.isObject(body, 'body is an object');
    expect(body).to.deep.equal({error: 'Invalid Query Param Found'});
  });

  after(()=>{
    stubDbGetGenre.restore();
    stubDbGetGenreByYear.restore();
  });
});

describe('/genre/all/:year Testing', ()=> {
  before(() =>{
    stubDbgetAllGenreByYear.resolves([
      {
        totalStreams : 500000,
        totalWeeklyPlacement : 1465,
        genre : 'Pop'
      },
      {
        totalStreams : 200000,
        totalWeeklyPlacement : 1000,
        genre : 'Rock'
      },
      {
        totalStreams : 100000,
        totalWeeklyPlacement : 600,
        genre : 'Metal'
      },
    ]);
  });

  it('Endpoint should return the 3 genres in 2017', async() =>{
    const response = await request(app).get('/api/genre/all/2017');
    const body = response.body;

    expect(body.data.length).to.equal(3);
    expect(response.status).to.equal(200);
  });

  it('Endpoint should return the 3 genres in 2017 and match the Pop properties/values', async() =>{
    const response = await request(app).get('/api/genre/all/2017');
    const body = response.body;

    expect(body.data[0]).to.have.property('totalStreams', 500000);
    expect(body.data[0]).to.have.property('totalWeeklyPlacement', 1465);
    expect(body.data[0]).to.have.property('genre', 'Pop');
    expect(response.status).to.equal(200);
  });

  it('Endpoint should return the 3 genres in 2017 and match the Rock properties/values', async() =>{
    const response = await request(app).get('/api/genre/all/2017');
    const body = response.body;

    expect(body.data[1]).to.have.property('totalStreams', 200000);
    expect(body.data[1]).to.have.property('totalWeeklyPlacement', 1000);
    expect(body.data[1]).to.have.property('genre', 'Rock');
    expect(response.status).to.equal(200);
  });

  it('Endpoint should return the 3 genres in 2017 and match the Metal values', async() =>{
    const response = await request(app).get('/api/genre/all/2017');
    const body = response.body;

    expect(body.data[2]).to.have.property('totalStreams', 100000);
    expect(body.data[2]).to.have.property('totalWeeklyPlacement', 600);
    expect(body.data[2]).to.have.property('genre', 'Metal');
    expect(response.status).to.equal(200);
  });
});

describe('/genre/all/:year Error Handling', () => {
  before(() => {
    stubDbgetAllGenreByYear.resolves([]);
  });

  it('Should Return error of empty fields from invalid year', async() =>{
    const response = await request(app).get('/api/genre/all/1999');
    const body = response.body;

    expect(body).to.deep.equal({ message: `No data found for 1999` });
    expect(response.status).to.equal(404);
  });

  after(() =>{
    stubDbgetAllGenreByYear.restore();
  });
});

/**
 * BillBoard top Object Example with 2015
 * 
 * body = {data: {
 *    year: 2015,
 *    list: [
 *      {
 *        rank: 1,
 *        year: 2015
 *        genre: Rock
 *        totalStreams: 56000000
 *      },
 *    ...Objects
 * ]}}
 * 
 * NOTE: INDEXES WILL CHANGE LATER ON
 */
describe('/api/streams/top/:year Tests', () =>{
  before(()=>{
    stubDbGetTopGenresByYear.resolves([
      {
        rank : 1,
        genre : 'Rock',
        totalStreams : 56000000
      },
      {
        rank : 2,
        genre : 'Pop',
        totalStreams : 50000000
      },
    ]);
  });

  it('Should check if the List of songs from 2017 have 2 entries', async () =>{
    const response = await request(app).get('/api/streams/top/2017');
    const body = response.body;
    expect(body.data.length).to.equal(2);
    expect(response.statusCode).to.equal(200);
  });

  it('Should check stub Data Rank 1 Matches', async () =>{
    const response = await request(app).get('/api/streams/top/2017');
    const body = response.body;
    expect(body.data[0]).to.have.property('rank', 1);
    expect(body.data[0]).to.have.property('genre', 'Rock');
    expect(body.data[0]).to.have.property('totalStreams', 56000000);

    expect(response.statusCode).to.equal(200);
  });
});

describe('/api/streams/top/:year Tests', ()=>{
  before(()=>{
    stubDbGetTopGenresByYear.resolves([]);
  });

  it('Should return error from invalid input', async () =>{
    const response = await request(app).get('/api/streams/top/1999');
    const body = response.body;
    expect(body).to.deep.equal({ message: 'No data found for this year' });
    expect(response.statusCode).to.equal(404);
  });

  after(()=>{
    stubDbGetTopGenresByYear.restore();
  });
});


/**
 * Billdboard Object Example
 *  body = {data : [{year: 2017,
 *          songs: [ {song: Perfect, genre: Pop ...}] }, 
 *          {year: 2018, songs: [...Object]}]}
 * 
 * Getting specific Year ex 2017
 *  body = {data: [{year: 2017, songs: [ {song: Perfect, genre: Pop ...}] ]}
 * 
 * NOTE: INDEXES WILL CHANGE LATER ON
 */

describe('Test for /api/billboard and /api/billboard?year=2017', () =>{
  before(() =>{
    stubDbGetBillBoardsongsByYear.resolves([
      {
        year: 2017,
        songs: [
          {
            title: 'Shape of You',
            artist: 'Ed Sheeran',
            weeksOnBoard: 30,
            streams: 400000000,
            genre: 'Pop'
          },
          {
            title: 'Despacito',
            artist: 'Luis Fonzi',
            weeksOnBoard: 50,
            streams: 1000000000,
            genre: 'Pop'
          },
        ]
      }
    ]);

    stubDbGetBillBoardSongs.resolves([
      {
        year: 2017,
        songs: [
          {
            title: 'Shape of You',
            artist: 'Ed Sheeran',
            weeksOnBoard: 30,
            streams: 400000000,
            genre: 'Pop'
          },
          {
            title: 'Despacito',
            artist: 'Luis Fonzi',
            weeksOnBoard: 50,
            streams: 1000000000,
            genre: 'Pop'
          },
        ]
      },
      {
        year: 2016,
        songs: [
          {
            title: 'One Dance',
            artist: 'Drake',
            weeksOnBoard : 70,
            streams: 1000000000,
            genre: 'R&B/Soul'
          },
          {
            title: 'Love Yourself',
            artist: 'Justin Bieber',
            weeksOnBoard : 65,
            streams: 900000,
            genre: 'Pop'
          },
        ]
      }
    ]);
  });

  it('Should return only songs of 2017 with query param', async () =>{
    const response = await request(app).get('/api/billboard?year=2017');
    const body = response.body;
    chai.assert.isObject(body, 'Body is an object');
    expect(body.data[0].year).to.equal(2017);
    expect(response.status).to.equal(200);
  });

  it('should match the number 2 song in 2017 top 100', async()=>{
    const response = await request(app).get('/api/billboard?year=2017');
    const body = response.body;

    expect(body.data[0]).to.have.property('year', 2017);
    expect(body.data[0].songs[1]).to.have.property('title', 'Despacito');
    expect(body.data[0].songs[1]).to.have.property('artist', 'Luis Fonzi');
    expect(body.data[0].songs[1]).to.have.property('weeksOnBoard', 50);
    expect(body.data[0].songs[1]).to.have.property('streams', 1000000000);
    expect(body.data[0].songs[1]).to.have.property('genre', 'Pop');
    expect(response.status).to.equal(200);
  });

  it('Should return songs from both 2017 and 2016', async() =>{
    const response = await request(app).get('/api/billboard');
    const body = response.body;

    expect(body.data[0]).to.have.property('year', 2017);
    expect(body.data[1]).to.have.property('year', 2016);
    expect(response.status).to.equal(200);
  });

  it('From fetching all, should return the #1 Song Data of 2016', async() =>{
    const response = await request(app).get('/api/billboard');
    const body = response.body;

    expect(body.data[1]).to.have.property('year', 2016);
    expect(body.data[1].songs[0]).to.have.property('title', 'One Dance');
    expect(body.data[1].songs[0]).to.have.property('artist', 'Drake');
    expect(body.data[1].songs[0]).to.have.property('weeksOnBoard', 70);
    expect(body.data[1].songs[0]).to.have.property('streams', 1000000000);
    expect(body.data[1].songs[0]).to.have.property('genre', 'R&B/Soul');
    expect(response.status).to.equal(200);
  });

  after(() =>{
    stubDbGetBillBoardSongs.restore();
  });
});

describe('/api/billboard and /api/billboard?year=2017 Error Handling', ()=>{
  before(()=>{
    stubDbGetBillBoardsongsByYear.resolves([]);
  });

  it('Should return Error from invalid year', async () =>{
    const response = await request(app).get('/api/billboard?year=1999');
    const body = response.body;
    chai.assert.isObject(body, 'Body is an object');
    expect(body).to.deep.equal({ error: 'No data found' });
    expect(response.status).to.equal(404);
  });

  it('Should return Error from invalid query parameter', async () =>{
    const response = await request(app).get('/api/billboard?year=1999');
    const body = response.body;

    expect(body).to.deep.equal({error: 'Invalid Query Param Found'})
    expect(response.status).to.equal(404);
  });

  after(() =>{
    stubDbGetBillBoardsongsByYear.restore();
  });
});