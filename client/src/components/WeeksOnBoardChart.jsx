import Chart from 'chart.js/auto'
import { useState } from "react";
import { Bar } from 'react-chartjs-2'

export default function WeeksOnboardchart(){
  const [weeklyPlacementData, setweeklyPlacementData] = useState([])
  const [year, setYear] = useState(2010);
  const [BarChartData, setBarChartData] = useState({
    labels : weeklyPlacementData.map((data) => data.genre),
    datasets: [
      {
      label : "Genres with Most Weeks on Board",
      data : weeklyPlacementData.map((data) => data.TotalWeeklyPlacement)
    }
    ] 
  });

  useEffect( () => {    
    async function fetchMostStreamedGenre(year) {
      
      try {
        const response = await fetch(`/api/genres/all/${year}`);
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
      <Bar data={BarChartData}/>
    </div>
  </>
}