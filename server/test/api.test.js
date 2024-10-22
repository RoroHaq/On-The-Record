import * as chai from 'chai'
import request from 'supertest'
import api from '../routers/api.mjs'
const expect = chai.expect;

describe("/api/genre/:genre and ?year=Num Testing", () =>{
  it("Should return Country Object in 2017", async()=>{
    const response = await request(api).get("/api/genre/Country?year=2017")
    const body = response.body;

    chai.assert.isObject(body, 'body is an object');

    expect(body).to.deep.equal() //TODO Check the Object which will be determined later
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

describe("/api/streams/top/:year Tests", () =>{
  it("Should check if the top years array has the genre data during 2016", async () =>{
    const response = await request(api).get("/api/streams/top/2016")
    const body = response.body
    body.forEach(genre =>{
      expect(genre.year).to.equal(2016)
    })
  })

  it("Should check if the top years array has the genre data during 2016", async () =>{
    const response = await request(api).get("/api/streams/top/2016")
    const body = response.body
    expect(body[0].rank).to.equal(1)
    expect(body[0].year).to.equal(2016)
  })
});

describe("Test for /api/billboard/:year", () =>{
  it("Should return a list of songs of 2017's Billboard top 100", async () =>{
    const response = await request(api).get("/api/billboard/2017")
    const body = response.body

    assert.isObject(body, "Body is an object")
    expect(body.songs.length).to.equal(100)
    chai.assert.strictEqual(body.songs[0].song, "Perfect", 'Top 1 songs of 2017 matches')
  })
  it("should match the number 1 song in 2017 top 100", async()=>{
    const response = await request(api).get("/api/billboard/2017")
    const body = response.body

    assert.isObject(body, "Body is an object")
    chai.assert.strictEqual(body.songs[0].song, "Perfect", 'Top 1 songs of 2017 matches')
  })
});