import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import "chart.js/auto";

export default function WeeksOnboardchart(){
  const [weeklyPlacementData, setweeklyPlacementData] = useState([])
  const [year, setYear] = useState(2010);
  const textColour = "#FAF9F6";
  const genreColors = {
    "Pop": "#36A2EB",
    "Hip-Hop/Rap": "#9966FF", 
    "Rock": "#FF6384",
    "R&B/Soul": "#5F5F79",
    "World/Traditional": "#FF9F40",
    "Electronic/Dance": "#8AC926",
    "Indie/Alternative": "#FF6F59",
    "Metal": "#FFCE56",
    "Classical/Orchestral": "#4BC0C0",
    "Other": "#C9CBCF",
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

  async function setWeeklyPlacementsOfYear(year){
    try {
      const response = await fetch(`/api/genre/all/${year}`);
      const json = await response.json();
      setweeklyPlacementData(json.data);
      setYear(year);
    } catch (error) {
      console.error("Error fetching genre data:", error);
    }
  };

  useEffect(() =>{
    setWeeklyPlacementsOfYear(year);
  }, []);

  const incrementYear = async () => {
    const updateyear = year == 2021 ? 2010 : year + 1;
    setWeeklyPlacementsOfYear(updateyear);
  };

  
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
