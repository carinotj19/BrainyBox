import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const difficulties = ["easy", "medium", "hard"];

function LeaderboardPage() {
  const [results, setResults] = useState({});
  const [selected, setSelected] = useState("easy");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/results/leaderboard")
      .then((res) => setResults(res.data))
      .catch(() => setError("Failed to load leaderboard"));
  }, []);

  const scores = results[selected] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 p-4 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full bg-white p-6 rounded-xl shadow"
      >
        <h1 className="text-3xl font-bold text-pink-600 mb-4 text-center">
          🏆 Leaderboard
        </h1>

        <div className="flex justify-center mb-4 gap-3">
          {difficulties.map((level) => (
            <button
              key={level}
              onClick={() => setSelected(level)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selected === level
                  ? "bg-pink-200 text-pink-900"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        {scores.length === 0 ? (
          <p className="text-center text-gray-600">No scores yet for {selected} difficulty.</p>
        ) : (
          <ul className="space-y-3">
            {scores.map((r, i) => (
              <li
                key={i}
                className="border rounded-lg p-4 bg-white shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {i === 0
                      ? "🥇"
                      : i === 1
                      ? "🥈"
                      : i === 2
                      ? "🥉"
                      : `#${i + 1}`}
                  </span>
                  <span className="font-semibold text-blue-700">
                    {r.username || "Unknown"}
                  </span>
                </div>
                <div className="text-sm text-right">
                  <p>
                    Score:{" "}
                    <strong>
                      {r.totalCorrect}/{r.totalQuestions}
                    </strong>
                  </p>
                  <p className="text-gray-600">
                    {Math.round((r.totalCorrect / r.totalQuestions) * 100)}%
                    accuracy
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

export default LeaderboardPage;
