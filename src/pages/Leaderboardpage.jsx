import { useEffect, useState } from "react";
import axios from "axios";

function LeaderboardPage() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:4000/api/results/leaderboard")
      .then((res) => setResults(res.data))
      .catch(() => setError("Failed to load leaderboard"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">🏆 Leaderboard</h1>

        {error && <p className="text-red-600">{error}</p>}

        <ul className="space-y-3">
          {results.map((r, i) => (
            <li key={r._id} className="border rounded p-3">
              <div className="flex justify-between">
                <span className="font-bold text-blue-700">{r.user?.username || "Anonymous"}</span>
                <span className="text-sm text-gray-500">{new Date(r.date).toLocaleString()}</span>
              </div>
              <div className="text-sm mt-1 text-gray-700">
                {r.category} · {r.difficulty} · Score: <strong>{r.score}/{r.total}</strong>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LeaderboardPage;
