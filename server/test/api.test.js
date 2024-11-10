/* eslint-disable no-undef */
import * as chai from 'chai';
import request from 'supertest';
import app from '../app.js';
import sinon from 'sinon';
import { db }  from '../db/db.js';

const stubDbGetGenre = sinon.stub(db, 'getGenre');
const stubDbGetGenreByYear = sinon.stub(db, 'getGenreByYear');
// const stubDbGetBillBoardSongs = sinon.stub(db, 'getBillBoardSongs');
// const stubDbGetBillBoardsongsByYear = sinon.stub(db, 'getBillBoardSongsByYear');
const stubDbGetTopGenresByYear = sinon.stub(db, 'getTopGenresByYear');

const expect = chai.expect;

/**
 * Genre Fetching Object Example:
 * body = {data: [
 *      {
 *        genre: Country, 
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
 *        genre: Country, 
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
        genre: 'Country',
        year: '2010',
        totalStreams : 450000,
        TotalWeeklyPlacement : 120
      },
      {
        genre: 'Country',
        year: '2011',
        totalStreams : 400000,
        TotalWeeklyPlacement : 110
      },
    ]);

    stubDbGetGenreByYear.resolves([
      {
        genre: 'Country',
        year: 2017,
        totalStreams : 4500000,
        TotalWeeklyPlacement : 150
      },
    ]);
  });

  it('Should Return a list of genre info through the years', async () =>{
    const response = await request(app).get('/api/genre/Pop');
   
    const body = response.body;
    expect(body.data.length).to.equal(2);
  });

  it('Should return Country Object in 2017', async()=>{
    const response = await request(app).get('/api/genre/Country?year=2017');
    const body = response.body;

    chai.assert.isObject(body, 'body is an object');

    expect(body.data[0]).to.have.property('genre', 'Country');
    expect(body.data[0]).to.have.property('year', 2017);
    expect(body.data[0]).to.have.property('totalStreams', 4500000);
    expect(body.data[0]).to.have.property('TotalWeeklyPlacement', 150);

    expect(response.statusCode).to.equal(200);
  });

  it('Should return all genres if given invalid queryParam', async()=>{
    const response = await request(app).get('/api/genre/country?number=2017');
    const body = response.body;

    chai.assert.isObject(body, 'body is an object');
    expect(body.data.length).to.equal(2);
    expect(response.statusCode).to.equal(200);
  });

  after(()=>{
    stubDbGetGenreByYear.restore();
  });
});

describe('/api/genre/:genre Error Handling', () =>{
  before(() =>{
    stubDbGetGenre.resolves('No data found for the specified genre');
  });

  it('Should Return an Empty String Error for Invalid Genre', async () =>{
    const response = await request(app).get('/api/genre/HocusPocus');
    const body = response.body;

    expect({message: body.data}).to.deep.equal({message: 'No data found for the specified genre'});
  });
  after(async () =>{
    stubDbGetGenre.restore();
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
        year: 2017,
        list: [
          {
            rank : 1,
            year: 2017,
            genre : 'Rock',
            totalStreams : 56000000
          },
          {
            rank : 2,
            year: 2017,
            genre : 'Pop',
            totalStreams : 50000000
          },
        ]
      }
    ]);
  });

  it('Should check if the List is songs from 2017', async () =>{
    const response = await request(app).get('/api/streams/top/2017');
    const body = response.body;
    expect(body.data[0].year).to.equal(2017);
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

/*
FOR PHASE 2
describe("Test for /api/billboard/:year", () =>{
  before(() =>{
    stubDbGetBillBoardsongsByYear.resolves([
      {
        year: 2017,
        songs: [
          {
            song: "Shape of You",
            artist: "Ed Sheeran",
            genre: "Pop"
          },
          {
            song: "Despacito",
            artist: "Luis Fonzi",
            genre: "Pop"
          },
        ]
      }
    ])
  });

  it("Should return only songs of 2017", async () =>{
    const response = await request(app).get("/billboard/2017")
    const body = response.body

    chai.assert.isObject(body, "Body is an object")
    expect(body.data.length).to.equal(1)
    expect(response.status).to.equal(200)
  });

  it("should match the number 2 song in 2017 top 100", async()=>{
    const response = await request(app).get("/billboard/2017")
    const body = response.body

    chai.assert.isObject(body, "Body is an object")

    expect(body.data[1]).to.have.property("year")
    expect(body.data[1].year).to.equal(2017)
    expect(body.data[1]).to.have.property("songs")
    expect(body.data[1].songs).to.have.property("song", "Despacito");
    expect(body.data[1].songs).to.have.property("artist", "Luis Fonzi");
    expect(body.data[1].songs).to.have.property("genre", "Pop");

  })
});

*/

/* 
FOR PHASE 2
describe("Test for /api/billboard", () =>{
  before(() =>{
    stubDbGetBillBoardSongs.resolves([
      {
        year: 2016,
        songs: [
          {
            song: "Perfect",
            artist: "Ed Sheeran",
            genre: "Pop"
          },
          {
            song: "Love Yourself",
            artist: "Justin Bieber",
            genre: "Pop"
          },
        ]
      }
    ])
  });

  it("Will Match Stub Number 1 song in 2016", async () =>{
    const response = await request(app).get("/billboard")
    const body = response.body

    chai.assert.isObject(body, "Body is an object")

    expect(body.data[0]).to.have.property("year")
    expect(body.data[0].year).to.equal(2016)
    expect(body.data[0]).to.have.property("songs")
    expect(body.data[0].songs).to.have.property("song", "Perfect");
    expect(body.data[0].songs).to.have.property("artist", "Ed Sheeran");
    expect(body.data[0].songs).to.have.property("genre", "Pop");

    expect(response.status).to.equal(200)
  });

  it("Will Match Stub Number 2 Song in 2016", async()=>{
    const response = await request(app).get("/billboard")
    const body = response.body

    chai.assert.isObject(body, "Body is an object")

    expect(body.data[1]).to.have.property("year")
    expect(body.data[1].year).to.equal(2016)
    expect(body.data[1]).to.have.property("songs")
    expect(body.data[1].songs).to.have.property("song", "Love Yourself");
    expect(body.data[1].songs).to.have.property("artist", "Justin Bieber");
    expect(body.data[1].songs).to.have.property("genre", "Pop");

    expect(response.status).to.equal(200)
  })
  
  after(() =>{
    stubDbGetBillBoardSongs.restore()
  })
})
*/