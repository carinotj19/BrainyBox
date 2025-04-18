import './App.css'
import { Routes, Route } from 'react-router-dom';
import Quizpage from './pages/Quizpage';
import Homepage from './pages/Homepage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/quiz" element={<Quizpage />} />
    </Routes>
  );
}

export default App
