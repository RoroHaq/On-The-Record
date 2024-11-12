import { useState, useEffect } from 'react';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement} from "chart.js/auto";
ChartJS.register(Tooltip, Legend, ArcElement);
export default function GenreStreamsChart(){
  const [year, setYear] = useState( 2010 );
  const [genreData, setGenreData] = useState( [] );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#fff',  
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
        color: "#fff",
        font: {
          size: 20
        },
        display: true,
        text: `Most streamed genres in ${year}`
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
      <Pie options={options} data={data} width={800} height={800} />
      <button onClick={incrementYear} type="button">Next Year!</button>
    </>
  )
} 