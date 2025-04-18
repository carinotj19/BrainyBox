import { useEffect, useState } from "react";
import axios from "axios";

function HistoryPage() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view your history.");
      return;
    }

    axios.get("http://localhost:4000/api/results/my", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setResults(res.data))
    .catch(() => setError("Failed to load results."));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">📜 Your Quiz History</h1>

        {error && <p className="text-red-600">{error}</p>}

        {!error && results.length === 0 && (
          <p className="text-gray-600">No results yet.</p>
        )}

        <ul className="space-y-3">
          {results.map((r, i) => (
            <li key={i} className="border rounded p-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-blue-700">
                  {r.category} · {r.difficulty}
                </span>
                <span className="text-gray-500">{new Date(r.date).toLocaleString()}</span>
              </div>
              <p className="mt-1">Score: <strong>{r.score}/{r.total}</strong></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HistoryPage;
