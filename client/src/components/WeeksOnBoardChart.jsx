import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import "chart.js/auto";

/**
 * Fetch WeeklyPlacements total of every genre of each year using a click event
 * @returns a Bar Chart representing the Billboard Weekly Placements Total of Each genre
 */
export default function WeeksOnboardchart(){
  const [weeklyPlacementData, setweeklyPlacementData] = useState([])
  const [year, setYear] = useState(2010);
  const textColour = "#FAF9F6";
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

  /**
   * This function handles with fetching the year and also setting the new year so that it uses
   * the latest state
   * @param {Number} year The Year to fetch data from
   */
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
              text: `Genres With Most Weekly Billboard Hot 100 Placements in ${year}`,
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
    
    <div className="transparent-background">
      <p>
        The billboard results also say something interesting about genres. Even though pop is often considered not as artistically utilized a genre, it still rakes in the top positions on the billboard for most of the years of its existence. Interestingly, almost to rebel against pop&apos;s dominance from 2011-2015, hip-hop actually gives pop a close run for its money in 2017 and then even manages to surpass it in 2018, 2019, and 2020. Another quirk of the data is the place of RnB.  From not hitting the top five genres for the majority of it&apos;s time on the billboard, this changes after 2015 and recent years show an RnB renessance where it consistently manages to land 4th place in recent years. One final piece of trivia is that classical as a genre only hit the billboard twice in the past decade. Both times are the result of the same song, &quot;The Hanging Tree&quot; from the Hunger Games OST, which was considered a classical song.
      </p>
    </div>
    </>
  );
}
