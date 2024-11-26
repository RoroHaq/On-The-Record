import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import "chart.js/auto";

export default function WeeksOnboardchart(){
  const [weeklyPlacementData, setweeklyPlacementData] = useState([])
  const [year, setYear] = useState(2010);

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

  let data = {
    labels : weeklyPlacementData.map((data) => data.genre),
    datasets: [
      {
        data : weeklyPlacementData.map((data) => data.totalWeeklyPlacement),
        backgroundColor: weeklyPlacementData.map((item) => genreColors[item.genre] || "#000000")
      }
    ] 
  };

  

  useEffect(() =>{
    async function setWeeklyPlacementsOfYear(year){
      try {
        console.log(year)
        const response = await fetch(`/api/genre/all/${year}`);
        const json = await response.json();
        setweeklyPlacementData(json.data); 
      } catch (error) {
        console.error("Error fetching genre data:", error);
      }
    }
    setWeeklyPlacementsOfYear(year)
  }, [year])

  const incrementYear = async () => {
    if (year == 2021){
      setYear(2010)
    }else{
      setYear((prevYear) =>{
        return prevYear + 1;
      })
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
