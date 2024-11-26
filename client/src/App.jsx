import './App.css'
import BackgroundDisk from './components/BackgroundDisk';
import GenreRatioChart from './components/GenreRatioChart';
import GenreStreamsChart from './components/GenreStreamsChart';
import Introduction from './components/Introduction';
import WeeksOnBoardChart from './components/WeeksOnBoardChart';
import Credits from './components/Credits';
import {Suspense} from 'react';

function App() {
  return (
    <div className="App">
      <BackgroundDisk/>
      <Introduction/>
      <Suspense fallback={<div>Loading</div>}>
        <GenreStreamsChart/>
      </Suspense>
      <Suspense fallback={<div>Loading</div>}>
        <WeeksOnBoardChart/>
      </Suspense>
      <Suspense fallback={<div>Loading</div>}>
        <GenreRatioChart/>
      </Suspense>
      <Credits/>
    </div>
  );
}

export default App;