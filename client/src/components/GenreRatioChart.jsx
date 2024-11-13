import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'

/**
 * Years which the database has access to
 */
const genreYears = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];

/**
 * Fetches genre objects for specific year (2017 for now) and ranks their popularity on a table
 * @returns table ranking how much genres were streamed in 2017.
 */
export default function GenreRatioChart() {
  
  const [genreData, setGenreData] = useState([]);

  useEffect( () => {    
    async function fetchGenre(year) {
      const genres = await fetch(`/api/genre/all/${year}`);
      const json = await genres.json();
      return await json.data;
    }
    
    async function fetchGenreDataForAllYears() {
      //TODO: temporary solution
      const retirevedGenreData = await Promise.all([
        // genreYears.map(fetchGenre)
        fetchGenre(2010),
        fetchGenre(2011),
        fetchGenre(2012),
        fetchGenre(2013),
        fetchGenre(2014),
        fetchGenre(2015),
        fetchGenre(2016),
        fetchGenre(2017),
        fetchGenre(2018),
        fetchGenre(2019),
        fetchGenre(2020),
        fetchGenre(2021)
      ]);

      setGenreData(retirevedGenreData)
    }

    fetchGenreDataForAllYears()
  }, []);

  let data = (genreData.length > 0) ? {
    labels: genreYears,
    datasets: genreYears.map( (year, index) => 
      [
        {
          data: [genreData[index].map((item) => item.totalStreams)],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF",
            "#8AC926",
            "#FF6F59",
          ],
          hoverOffset: 4,
          "id": year,
          "label": "Purchase amount (USD)",
          "yAxisID":"left"
        }
      ]
    )
  } : null

  return (
    <div className="chart-container" id="ha">
      <h2 id="haha" style={{ textAlign: "center" }}>Bar Chart</h2>
      
      {
      data ? 
        <Line
          data={data}
          options={{
            plugins: {
              title: {
                display: true,
                text: "2012 Streaming Data"
              },
              legend: {
                display: false
              }
            }
          }}
        />
      : <p>Loading</p>
      }
      
    </div>
  );
}