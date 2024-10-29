import fs from 'node:fs/promises'
import neat from 'neat-csv'
async function getBillBoardData(){
  try{
    let response = await fs.readFile('charts.csv')
    
    const data = await neat(response)

    return data
  }catch(Error){
    console.log(Error)
  }
}

async function filterBillBoardData(){
  try{
    let songs = await getBillBoardData()
    const startDate = new Date('2010-01-01').toJSON().slice(0, 10);
    const endDate = new Date('2021-12-31').toJSON().slice(0, 10);
    let filtered = songs.filter(song => song.date >= startDate && song.date <= endDate)

    return filtered
  }catch (Error){
    console.log(Error)
  }
}

async function getSpotifyData() {
  try{
    let response = await fs.readFile('spotify_full_list.csv')
    
    const data = await neat(response)

    return data
  }catch(Error){
    console.log(Error)
  }
}

async function filterSpotifyData(){
  try{
    let songs = await getSpotifyData()
    const startDate = new Date('2010-01-01').getFullYear()+1
    const endDate = new Date('2021-12-31').getFullYear()
    
  }catch(Error){
    console.log(Error)
  }
}