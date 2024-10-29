import * as chai from 'chai'
import request from 'supertest'
import api from '../routers/api.mjs'
import sinon from 'sinon'
import { db } from '../db/db.js'

let stubDbGetGenre = sinon.stub(db, "getGenre")
let stubDbGetGenreByYear = sinon.stub(db, "getGenreByYear")
let stubDbGetBillBoardSongs = sinon.stub(db, "getBillBoardSongs")
let stubDbGetBillBoardsongsByYear = sinon.stub(db, "getBillBoardSongsByYear")

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
describe("/api/genre/:genre and ?year=Num Testing", () =>{
  before(() =>{
    stubDbGetGenre.resolves({data: [
      {
        genre: "Country",
        year: "2010",
        totalStreams : 450000,
        TotalWeeklyPlacement : 120
      },
      {
        genre: "Country",
        year: "2011",
        totalStreams : 400000,
        TotalWeeklyPlacement : 110
      },
    ]})

    stubDbGetGenreByYear.resolves({data: [
      {
        genre: "Country",
        year: 2017,
        totalStreams : 4500000,
        TotalWeeklyPlacement : 150
      },
    ]})
  });

  it("Should Return a list of genre info through the years", async() =>{
    const response = await request(api).get("/api/genre/Country")
    const body = response.body;

    expect(body.data.length).to.equal(2)
  });

  it("Should Return an Error for an Invalid Genre", async() =>{
    const response = await request(api).get("/api/genre/HocusPocus")
    const body = response.body;

    expect(body).to.deep.equal({error: "Invalid Genre"})
  });

  it("Should return Country Object in 2017", async()=>{
    const response = await request(api).get("/api/genre/Country?year=2017")
    const body = response.body;

    chai.assert.isObject(body, 'body is an object');

    expect(body.data[0]).to.have.property('genre', 'Country');
    expect(body.data[0]).to.have.property('year', 2017);
    expect(body.data[0]).to.have.property('totalStreams', 4500000);
    expect(body.data[0]).to.have.property('TotalWeeklyPlacement', 150);

    expect(response.statusCode).to.equal(200);
  });

  it("Should return invalid query param", async()=>{
    const response = await request(api).get("/api/genre/Country?number=2017")
    const body = response.body;

    chai.assert.isObject(body, 'body is an object');
    expect(body).to.deep.equal({error: "Invalid query Parameter"})
    expect(response.statusCode).to.equal(404);
  });

  after(()=>{
    stubDbGetGenre.restore();
    stubDbGetGenreByYear.restore();
  })
});
/**
 * BillBoard top Object Example with 2015
 * 
 * body = {data: [
 *      {
 *        rank: 1,
 *        year: 2015
 *        genre: Rock
 *        totalStreams: 56000000
 *      },
 *    ...Objects
 * ]}
 * 
 * NOTE: INDEXES WILL CHANGE LATER ON
 */
describe("/api/streams/top/:year Tests", () =>{
  it("Should check if the top years array has the genre data during 2016", async () =>{
    const response = await request(api).get("/api/streams/top/2016")
    const body = response.body
    body.data.forEach(result =>{
      expect(result.year).to.equal(2016)
    })
    expect(response.statusCode).to.equal(200);
  })

  it("Should check if the top years array has the genre data during 2016", async () =>{
    const response = await request(api).get("/api/streams/top/2016")
    const body = response.body
    expect(body.data[0].rank).to.equal(1)
    expect(body.data[0].year).to.equal(2016)
  })
});
/**
 * Billdboard Object Example
 *  body = {data : [{year: 2017, songs: [ {song: Perfect, genre: Pop ...}] }, {year: 2018, songs: [...Object]}]}
 * 
 * Getting specific Year ex 2017
 *  body = {data: [{year: 2017, songs: [ {song: Perfect, genre: Pop ...}] ]}
 * 
 * NOTE: INDEXES WILL CHANGE LATER ON
 */
describe("Test for /api/billboard/:year", () =>{
  it("Should return a list of songs of 2017's Billboard top 100", async () =>{
    const response = await request(api).get("/api/billboard/2017")
    const body = response.body

    assert.isObject(body, "Body is an object")
    expect(body.data[0].songs.length).to.equal(100)
  })
  it("should match the number 1 song in 2017 top 100", async()=>{
    const response = await request(api).get("/api/billboard/2017")
    const body = response.body

    assert.isObject(body, "Body is an object")
    chai.assert.strictEqual(body.data[0].songs[0].song, "Perfect", 'Top 1 songs of 2017 matches')
  })
});

describe("Test for /api/billboard", () =>{
  before(() =>{
    stubDbGetBillBoardSongs.resolves({data:[
      {
        year: 2016,
        songs: [
          {
            song: "Perfect",
            artist: "Ed Sheeran",
            genre: "Pop"
          },
          {
            song: "GOOD 4 U",
            artist: "Olivia Rodrigo",
            genre: "Pop"
          },
        ]
      }
    ]})
  });
  it("Will Match Stub Number 1 song in 2016", async () =>{
    const response = await request(api).get("/api/billboard")
    const body = response.body

    assert.isObject(body, "Body is an object")

    expect(body.data[0]).to.have.property("year")
    expect(body.data[0].year).to.equal(2016)
    expect(body.data[0]).to.have.property("songs")
    expect(body.data[0].songs).to.have.property("song", "Perfect");
    expect(body.data[0].songs).to.have.property("artist", "Ed Sheeran");
    expect(body.data[0].songs).to.have.property("genre", "Pop");

    expect(response.status).to.equal(200)
  });
  it("Will Match Stub Number 2 Song in 2016", async()=>{
    const response = await request(api).get("/api/billboard")
    const body = response.body

    assert.isObject(body, "Body is an object")

    expect(body.data[0]).to.have.property("year")
    expect(body.data[0].year).to.equal(2016)
    expect(body.data[0]).to.have.property("songs")
    expect(body.data[0].songs).to.have.property("song", "GOOD 4 U");
    expect(body.data[0].songs).to.have.property("artist", "Olivia Rodrigo");
    expect(body.data[0].songs).to.have.property("genre", "Pop");

    expect(response.status).to.equal(200)
  })
  
  after(() =>{
    stubDbGetBillBoardSongs.restore()
  })
})