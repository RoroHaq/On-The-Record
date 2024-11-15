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

      console.log(genreMap)
      return genreMap
    }
    
    async function fetchGenreDataForAllYears() {
      //TODO: make code below cleaner and have it iterate of genreYears
      const retirevedGenreData = await Promise.all([
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

      setGenreData(verticallyAdjustGenreData(retirevedGenreData))
    }

    fetchGenreDataForAllYears()
  }, []);

  const colourArray =  [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#C9CBCF",
            "#8AC926",
            "#FF6F59",
            "#FF6FFF",
          ]

  let data = (genreData.length > 0) ? {
    labels: genreYears,
    datasets: genreData.map( (genreArray, index) => {
      return {
        data: genreArray.map((item) => item.totalStreams / item.totalWeeklyPlacement),
        backgroundColor: "#000000",
        borderColor: colourArray[index],
        hoverOffset: 4,
        id: genreArray[0].genre,
        label: genreArray[0].genre,
      }
    })
  } : null

  const textColour = "#FAF9F6"  
  return (
    <div className={["chart-container", "transparent-background"].join(" ")}>
      {
        //TODO replace following if statement with suspend component
        //if statement for data
        data ? 
          <Line
            data={data}
            options={{
              color: textColour,
              scales: {
                x: {
                  ticks: {
                    color:textColour
                  }
                },
                y: {
                  ticks: {
                    color:textColour
                  },
                  title:{
                    display: true,
                    text: "Streams per Billboard entry",
                    color:textColour
                  }
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: "Yearly Streams per Billboard entry",
                  color:textColour,
                  fullSize: true,
                  font: {
                    size: '30em'
                  }
                },
                legend: {
                  display: true,
                  labels: {
                    boxWidth: 20
                  }
                }
              }
            }}
          />
        : <p>Loading</p>
      }
    </div>
  );
}