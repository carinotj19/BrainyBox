import './App.css'
import { Routes, Route } from 'react-router-dom';
import Quizpage from './pages/Quizpage';
import Homepage from './pages/Homepage';
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import Historypage from "./pages/Historypage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/quiz" element={<Quizpage />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/register" element={<Registerpage />} />
      <Route path="/history" element={<Historypage />} />
    </Routes>
  );
}

export default App
