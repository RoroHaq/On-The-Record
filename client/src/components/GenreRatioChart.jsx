import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'

/**
 * Fetches genre objects for specific year (2017 for now) and ranks their popularity on a table
 * @returns table ranking how much genres were streamed in 2017.
 */
export default function GenreRatioChart() {
  
  const [genreData, setGenreData] = useState( [] );

  useEffect( () => {    
    async function fetchMostStreamedGenre(year) {
      const genres = await fetch(`/api/streams/top/${year}`);
      const json = await genres.json();
      // setGenreData( gd => {
      //   const newArr = gd;
      //   newArr.push(json.data);
      //   return newArr;
      // });
      setGenreData(json.data)
    }
    fetchMostStreamedGenre(2013);
  }, []);

  useEffect( () =>
    {
      setChartData({
        labels: genreData.map((data) => data.genre), 
        datasets: [
          {
            label: "Genre Data",
            data: genreData.map((data) => data.totalStreams),
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0"
            ],
            borderColor: "black",
            borderWidth: 5
          }
        ]
      })
    }, [genreData] );

  // const data = [
  //   { year: 2010, count: 10 },
  //   { year: 2011, count: 20 },
  //   { year: 2012, count: 15 },
  //   { year: 2013, count: 25 },
  //   { year: 2014, count: 22 },
  //   { year: 2015, count: 30 },
  //   { year: 2016, count: 28 }
  // ];

  console.log(genreData)

  const [chartData, setChartData] = useState({});

  return (
    <div className="chart-container" id="ha">
      <h2 id="haha" style={{ textAlign: "center" }}>Bar Chart</h2>
      <Bar
        data={chartData}
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
    </div>
  );
}