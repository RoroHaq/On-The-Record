import { useState, useEffect } from 'react';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement} from "chart.js/auto";
ChartJS.register(Tooltip, Legend, ArcElement);
/**
 * Fetches streams for each genre for every year and places them in a pie chart
 * @returns a pie chart with each genre ranked based on that genre's number of streams 
 */

export default function GenreStreamsChart(){
  const [year, setYear] = useState( 2010 );
  const [genreData, setGenreData] = useState( [] );

  const textColour = "#FAF9F6"  
  const genreColors = {
    "Pop": "#FF6384",
    "Hip-Hop/Rap": "#36A2EB", 
    "Rock": "#FFCE56",
    "R&B/Soul": "#C9CBCF",
    "World/Traditional": "#4BC0C0",
    "Electronic/Dance": "#FF9F40",
    "Indie/Alternative": "#8AC926",
    "Metal": "#9966FF",
    "Classical/Orchestral": "#FF6FFF",
    "Other": "#5F5F79",
  };

  const options = {
    color: textColour,
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        color: textColour, 
        labels: {
          color: textColour,  
          font: {
            size: 14, 
          },
          boxWidth: 20,
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, index) => {
              const totalStreams = data.datasets[0].data[index];
              return {
                text: `${label}: ${totalStreams.toLocaleString()} streams`,
                fillStyle: data.datasets[0].backgroundColor[index],
                hidden: false,
                index: index,
                fontColor: textColour,
              };
            });
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const total = tooltipItem.dataset.data.reduce((sum, value) => sum + value, 0);
            const currentValue = tooltipItem.raw;
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}% of total streams`;
          },
        },
      },
      title: {
        display: true,
        text: `Most streamed genres in ${year}`,
        color: textColour,
        font: {
          size: 20
        }
      }
    },
  };
  
  useEffect( () => {    
    async function fetchMostStreamedGenre(year) {
      
      try {
        const response = await fetch(`/api/streams/top/${year}`);
        const json = await response.json();
        setGenreData(json.data); 
      } catch (error) {
        console.error("Error fetching genre data:", error);
      }
    }

    fetchMostStreamedGenre(year);
  }, [year]);
  let data ={
    labels: genreData.map((item) => item.genre),
    datasets: [
      {
        data: genreData.map((item) => item.totalStreams),
        backgroundColor: genreData.map((item) => genreColors[item.genre] || "#000000"),
        hoverOffset: 4,
      },
    ]
  }
  
  const incrementYear = () => {
    if (year == 2021){
      setYear(2010)
    } else{
      setYear(year+1)
    }
  }
  return (
    <>
    <div className={["chart-container", "transparent-background"].join(" ")}>
      <Pie options={options} data={data} width={600} height={400} />
      <button onClick={incrementYear} className="chart-button" type="button">Next Year!</button>
    </div>
    </>
  );
} 