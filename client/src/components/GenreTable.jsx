import { useState, useEffect } from 'react';

/**
 * Fetches genre objects for specific year (2017 for now) and ranks their popularity on a table
 * @returns table ranking how much genres were streamed in 2017.
 */
export default function GenreTable() {

  const [genreData, setGenreData] = useState( [] );

  useEffect( () => {    
    async function fetchMostStreamedGenre(year) {
      const genres = await fetch(` http://localhost:3000/api/streams/top/${year}`);
      return await genres.json();
    }
    
    async function fetchMostStreamedGenre2017() {
      const retirevedGenreData = await fetchMostStreamedGenre(2017);
      setGenreData(retirevedGenreData);
    }

    fetchMostStreamedGenre2017();
  }, []);

  return (
    <>
      <h1>Most streamed genres in 2017</h1>
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
            {Array.from(genreData).map( g => {
              return <th key={g.rank}> Streams: {g.totalStreams.toLocaleString()}</th>
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
}