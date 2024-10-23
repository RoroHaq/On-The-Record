import * as chai from 'chai'
import request from 'supertest'
import api from '../routers/api.mjs'
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
  it("Should return Country Object in 2017", async()=>{
    const response = await request(api).get("/api/genre/Country?year=2017")
    const body = response.body;

    chai.assert.isObject(body, 'body is an object');

    expect(body).to.deep.equal(
      {data: [{
        "genre" : "Country",
        "year" : 2019,
        "totalStreams" : 100000,
        "totalBillBoardPlacements": 49
      }]}
  )
    expect(response.statusCode).to.equal(200);
  });

  it("Should return invalid query param", async()=>{
    const response = await request(api).get("/api/genre/Country?number=2017")
    const body = response.body;

    chai.assert.isObject(body, 'body is an object');
    expect(body).to.deep.equal({error: "Invalid query Parameter"})
    expect(response.statusCode).to.equal(404);
  });
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
  it("Top 100 will match the year its fetched from, which is 2016", async () =>{
    const response = await request(api).get("/api/billboard")
    const body = response.body
    assert.isObject(body, "Body is an object")
    expect(body.data[0].year).to.equal(2016) //Index will change when we know the proper location of the year
  });
  it("Filter through and match the top 1 song in 2017", async()=>{
    const response = await request(api).get("/api/billboard")
    const body = response.body
    body.songs.filter((song) => song.year === 2017)
    assert.isObject(body, "Body is an object")
    chai.assert.strictEqual(body.data[0].songs[0].song, "Perfect", 'Top 1 songs of 2017 matches')
  })
})