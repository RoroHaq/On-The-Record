import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
// the following import, in spite of being unused explicity in the code, is used implicity by chart.js to fix certain bugs
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto'

/**
 * Years which the database has access to
 */
const genreYears = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];

/**
 * Fetches genre objects for every and places them on a multi-axis line chart
 * @returns multi-axis line chart with each genre ranked on the ratio of that genre's streams to its billboard placements
 */

export default function GenreRatioChart() {
  
  const [genreData, setGenreData] = useState([]);

  useEffect( () => {    
    async function fetchGenre(year) {
      const genres = await fetch(`/api/genre/all/${year}`);
      const json = await genres.json();
      return await json.data;
    }

    /**
     * Flips the data to, instead of having the data seperated by year, have it seperated by genre
     * @returns flipped genre data over the given years
     */
    function verticallyAdjustGenreData(data) {
      const genreList = [... new Set(data.map(d => d.map(d => d.genre)).flat())];
      const genreMap = genreList.map(name => {
        const genrePerYear = data.map( d => d.filter(g => g.genre === name))
          .map(g => {
            if (g.length == 0){
              return {'totalStreams': 0, 'totalWeeklyPlacement': 0, 'genre': name}
            }
            else{
              return g
            }
          }).flat();
        return genrePerYear;
      })
      return genreMap;
    };

    async function fetchGenreDataForAllYears() {
      const retrievedGenreData = await Promise.all(
        genreYears.map((year) => fetchGenre(year))
      );
      setGenreData(verticallyAdjustGenreData(retrievedGenreData));
    };

    fetchGenreDataForAllYears();
  }, []);

  const colourArray = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
    "#8AC926",
    "#5F5F79",
    "#FF6FFF",
    "#61DAFB",
    "#D2691E",
  ];

  let data =
    genreData.length > 0
      ? {
          labels: genreYears,
          datasets: genreData.map((genreArray, index) => ({
            data: genreArray.map(
              (item) => item.totalStreams / item.totalWeeklyPlacement
            ),
            backgroundColor: "#000000",
            borderColor: colourArray[index],
            borderWidth: 2,
            hoverBorderWidth: 3,
            hoverBorderColor: colourArray[index % colourArray.length],
            label: genreArray[0].genre,
          })),
        }
      : null;

  const textColour = "#FAF9F6";
  return (
    <div className={["chart-container", "transparent-background"].join(" ")}>
      {data ? (
        <Line
          data={data}
          height={700} 
          width={800} 
          options={{
            color: textColour,
            maintainAspectRatio: false, 
            scales: {
              x: {
                ticks: {
                  color: textColour,
                },
              },
              y: {
                ticks: {
                  color: textColour,
                },
                title: {
                  display: true,
                  text: "Streams per Billboard Entry",
                  color: textColour,
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: "Yearly Streams per Billboard Entry",
                color: textColour,
                font: {
                  size: 20,
                },
              },
              legend: {
                display: true,
                labels: {
                  boxWidth: 20,
                  color: textColour,
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}