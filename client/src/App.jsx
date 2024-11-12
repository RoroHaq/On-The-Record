import './App.css'
import GenreTable from './components/GenreTable';
import BackgroundDisk from './components/BackgroundDisk';

function App() {
  return (
    <div className="App">
      <BackgroundDisk/>
      <GenreTable />
    </div>
  );
}

export default App;