import fs from 'node:fs/promises'
import neat from 'neat-csv'
async function getFileData(){
  try{
    let response = await fs.readFile('charts.csv')
    
    const data = await neat(response)

    return data
  }catch(Error){
    console.log(Error)
  }
}

async function filterData(){
  try{
    let songs = await getFileData()
    const startDate = new Date('2010-01-01').toJSON().slice(0, 10);
    const endDate = new Date('2021-12-31').toJSON().slice(0, 10);
    let filtered = songs.filter(song => song.date >= startDate && song.date <= endDate)

    return filtered
  }catch (Error){
    console.log(Error)
  }
}

let data = await filterData()
console.log(data[data.length-1])