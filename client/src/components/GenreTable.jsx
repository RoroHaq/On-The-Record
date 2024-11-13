import { useState, useEffect } from 'react';

/**
 * GenreTable component fetches and displays the most streamed genres for a specific year.
 * @component
 * @returns {JSX.Element} Table showing ranked genres and their streaming totals.
 */
export default function GenreTable() {

  const [genreData, setGenreData] = useState( [] );
  const [year, setYear] = useState( 2010 );

  useEffect( () => {    
    async function fetchMostStreamedGenre(year) {
      const genres = await fetch(`/api/streams/top/${year}`);
      const json = await genres.json();
      setGenreData(json.data);
    }
    
    fetchMostStreamedGenre(year);
  }, [year]);

  const incrementYear = () => {
    if (year == 2021){
      setYear(2010)
    } else{
      setYear(year+1)
    }
  }

  return (
    <div style={{
      position:'relative',
      zIndex:1}}>
      <h1>
        Most streamed genres in {year}
      </h1>
      <button onClick={incrementYear} type="button">Next Year!</button>
      <h4>(based on wether or not the streamed songs of the genre in question hit the billboard top 100)</h4>
      <hr/>
      <table>
        <thead>
          <tr>
            {Array.from(genreData).map( g => {
              return <th key={g.rank}> {g.genre}</th>
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Array.from(genreData).map( g => {
              return <th key={g.rank}> Rank: {g.rank}</th>
            })}
          </tr>
          <tr>
            {Array.from(genreData).map( (g, index) => {
              let colour;
              if (index % 2){
                colour = 'turquoise';
              } else{
                colour = 'blue';
              }
              return <th key={g.rank}> Streams: <br/> <span style={{color: colour}}>{g.totalStreams.toLocaleString()}</span></th>
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}