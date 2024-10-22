import * as chai from 'chai'
import request from 'supertest'
import api from '../routers/api.mjs'
const expect = chai.expect;

describe("/api/genre/:genre and ?year=Num Testing", () =>{
  it("Should return Country Object in 2017", async()=>{
    const response = await request(api).get("/api/genre/Country?year=2017")

    expect(response.body()).to.deep.equal() //TODO Check the Object which will be determined later
    expect(response.statusCode).to.equal(200);
  })

  it("Should return invalid query param", async()=>{
    const response = await request(api).get("/api/genre/Country?number=2017")

    expect(response.body()).to.deep.equal({error: "Invalid query Parameter"})
    expect(response.statusCode).to.equal(404);
  })
})