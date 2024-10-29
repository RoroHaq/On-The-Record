import fs from 'node:fs/promises'
import neat from 'neat-csv'
async function getBillBoardData(){
  try{
    const response = await fs.readFile('charts.csv')
    
    const data = await neat(response)

    return data
  }catch(Error){
    console.log(Error)
  }
}

async function filterBillBoardData(){
  try{
    const songs = await getBillBoardData()
    const startDate = new Date('2010-01-01').toJSON().slice(0, 10);
    const endDate = new Date('2021-12-31').toJSON().slice(0, 10);
    return songs.filter(song => song.date >= startDate && song.date <= endDate)
  }catch (Error){
    console.log(Error)
  }
}

async function getSpotifyData() {
  try{
    const response = await fs.readFile('spotify_full_list.csv')
    
    const data = await neat(response)

    return data
  }catch(Error){
    console.log(Error)
  }
}

async function filterSpotifyData(){
  try{
    const songs = await getSpotifyData()
    const startDate = new Date('2010-01-01').getFullYear()+1
    const endDate = new Date('2021-12-31').getFullYear()

    return songs.filter(song => song.year >= startDate && song.year <= endDate)
  }catch(Error){
    console.log(Error)
  }
}