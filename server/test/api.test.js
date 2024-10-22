import * as chai from 'chai'
import request from 'supertest'
import api from '../routers/api.mjs'
const expect = chai.expect;

describe("Genre Endpoints", () =>{
  it("Should return Country Object in 2017", async()=>{
    const response = await request(api).get("/api/genre/Country?year=2017")

    expect(response.body()).to.deep.equal() //TODO Check the Object which will be determined later
    expect(response.statusCode).to.equal(200);
  })  
})