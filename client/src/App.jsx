import './App.css'
// import GenreTable from './components/GenreTable';
import BackgroundDisk from './components/BackgroundDisk';
import GenreRatioChart from './components/GenreRatioChart';
import GenreStreamsChart from './components/GenreStreamsChart';
import Introduction from './components/Introduction';
import WeeksOnBoardChart from './components/WeeksOnBoardChart';
import Credits from './components/Credits';

function App() {
  return (
    <div className="App">
      <BackgroundDisk/>
      <Introduction/>
      <GenreStreamsChart/>
      <WeeksOnBoardChart/>
      <GenreRatioChart/>
      <Credits/>
    </div>
  );
}

export default App;