import Quizpage from "./pages/Quizpage";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import Historypage from "./pages/Historypage";
import Leaderboardpage from "./pages/Leaderboardpage";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/quiz" element={<Quizpage />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/register" element={<Registerpage />} />
      <Route path="/history" element={<Historypage />} />
      <Route path="/leaderboard" element={<Leaderboardpage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
