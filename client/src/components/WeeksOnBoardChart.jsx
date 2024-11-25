import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import "chart.js/auto";

export default function WeeksOnboardchart(){
  const [weeklyPlacementData, setweeklyPlacementData] = useState([])
  const [year, setYear] = useState(2010);
  
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

  let data = {
    labels : weeklyPlacementData.map((data) => data.genre),
    datasets: [
      {
        data : weeklyPlacementData.map((data) => data.totalWeeklyPlacement),
        backgroundColor: colourArray
      }
    ] 
  };

  useEffect( () => {    
    async function fetchTotalWeeklyPlacementsByYear(year) {
      
      try {
        const response = await fetch(`/api/genre/all/${year}`);
        const json = await response.json();
        setweeklyPlacementData(json.data); 
      } catch (error) {
        console.error("Error fetching genre data:", error);
      }
    }

    fetchTotalWeeklyPlacementsByYear(year);
  }, [year]);

  const incrementYear = () => {
    if (year == 2021){
      setYear(2010)
    } else{
      setYear(year+1)
    }
  }

  const textColour = "#FAF9F6";
  return (
    <>
    <div className={["chart-container", "transparent-background"].join(" ")}>
      <Bar
       
        data={data}
        height={500} 
          width={600} 
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: textColour } },
            y: { ticks: { color: textColour } },
          },
          plugins: {
            title: {
              display: true,
              text: `Genres With Most Weekly Placements in ${year}`,
              color: textColour,
              font: { size:20 },
            },
            legend: {
              display: false,
            },
          },
        }}
      />
      <button onClick={incrementYear} className="chart-button" type="button">Next Year!</button>
    </div>
    </>
  );
}
