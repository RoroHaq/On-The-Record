import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2'
import Chart from "chart.js/auto";

export default function WeeksOnboardchart(){
  const [weeklyPlacementData, setweeklyPlacementData] = useState([])
  const [year, setYear] = useState(2010);
  
  let data = {
    labels : weeklyPlacementData.map((data) => data.genre),
    datasets: [
      {
      data : weeklyPlacementData.map((data) => data.totalWeeklyPlacement)
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
  return <>
    <div>
      <Bar data={data}
        options={{
          plugins: {
            title: {
              display: true,
              text: `Genres With Most Weekly Placements in ${year}`
            },
            legend: {
              display: false
            }
          }
        }}
      />
      <button onClick={incrementYear} type="button">Next Year!</button>
    </div>
  </>
}