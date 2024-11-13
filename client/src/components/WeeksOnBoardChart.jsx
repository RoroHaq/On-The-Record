import Chart from 'chart.js/auto'
import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2'

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
    async function fetchMostStreamedGenre(year) {
      
      try {
        const response = await fetch(`/api/genre/all/${year}`);
        const json = await response.json();
        setweeklyPlacementData(json.data); 
      } catch (error) {
        console.error("Error fetching genre data:", error);
      }
    }

    fetchMostStreamedGenre(year);
  }, [year]);

  return <>
    <div>
      <Bar data={data}
        options={{
          plugins: {
            title: {
              display: true,
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  </>
}