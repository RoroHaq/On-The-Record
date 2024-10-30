import fs from 'node:fs/promises'
import neat from 'neat-csv'
async function getBaseBillBoardData(){
  try{
    const response = await fs.readFile('charts.csv')
    
    const data = await neat(response)

    return data
  }catch(Error){
    console.log(Error)
  }
}

async function getFilteredBillBoardData(){
  try{
    const songs = await getBaseBillBoardData()
    const startDate = new Date('2010-01-01').toJSON().slice(0, 10);
    const endDate = new Date('2021-12-31').toJSON().slice(0, 10);
    return songs.filter(song => song.date >= startDate && song.date <= endDate)
  }catch (Error){
    console.log(Error)
  }
}

async function getMappedBillBoardData(spotify_data){
  try{
    const songs = await getFilteredBillBoardData()

    const deriveNewFields = (song) => {
      song.title = song.song;
      song.year = parseInt(song.date.slice(0,4));
      return song;
    }

    const addTimeOnBoard = (song) => {
      song.weeksOnBoard = songs.filter((s) => {
        return s.artist === song.artist 
          && s.title === song.title 
          && s.year == song.year
      }).length

      return song
    }

    const removeFeaturedArtist = (song) => {
      if (song.artist.indexOf(" Featuring") !== -1){
        song.artist = song.artist.substring(0, song.artist.indexOf(" Featuring"))
      }
      return song;
    }

    const removeUnneededFields = (song) => {
      delete song.song
      delete song.date
      delete song.rank
      delete song['last-week']
      delete song['peak-rank']
      delete song['weeks-on-board']
      return song
    }

    return songs
      .map(deriveNewFields)
      .map(removeFeaturedArtist)
      .map(removeUnneededFields)
  }catch (Error){
    console.log(Error)
  }
}

async function getBaseSpotifyData() {
  try{
    const response = await fs.readFile('spotify_full_list.csv')

    const data = await neat(response)

    return data
  }catch(Error){
    console.log(Error)
  }
}

async function getFilteredSpotifyData(){
  try{
    const songs = await getBaseSpotifyData()
    const startDate = new Date('2010-01-01').getFullYear()+1
    const endDate = new Date('2021-12-31').getFullYear()

    return songs.filter(song => song.year >= startDate && song.year <= endDate)
      .filter(song => song.main_genre !== '')
  }catch(Error){
    console.log(Error)
  }
}

async function getMappedSpotifyData(){
  try{
    const songs = await getFilteredSpotifyData()

    const deriveNewFields = (song) => {
      //.title provides the title of the song without the artist
      const offset = 3
      song.title = song['Artist and Title'].slice(song.Artist.length + offset, song['Artist and Title'].length)

      //.genre renames the .main_genre field
      song.genre = song.main_genre
      return song
    }

    const removeUnneededFields = (song) => {
      delete song.genres
      delete song.main_genre
      delete song.first_genre
      delete song.second_genre
      delete song.third_genre
      delete song.Daily
      delete song.id
      delete song['Artist and Title']
      return song
    }

    const makeFieldsLowerCase = (song) => {
      song.artist = song.Artist
      song.streams = song.Streams
      delete song.Artist
      delete song.Streams
      return song
    }

    const roundYearField = (song) => {
      song.year = parseInt(song.year)
      return song
    }

    return songs
                .map(deriveNewFields)
                .map(removeUnneededFields)
                .map(makeFieldsLowerCase)
                .map(roundYearField)

  }catch(Error){
    console.log(Error)
  }
}