import Chart from 'chart.js/auto'
import { useState } from "react";
import { Bar } from 'react-chartjs-2'

export default function WeeksOnboardchart({weeksOnBoardData}){

  const [BarChartData, setBarChartData] = useState({
    labels : weeksOnBoardData.map((data) => data.genre),
    datasets: [
      {
      label : "Genres with Most Weeks on Board",
      data : weeksOnBoardData.map((data) => data.TotalWeeklyPlacement)
    }
    ] 
  });

  return <>
    <div>
      <Bar data={BarChartData}/>
    </div>
  </>
}