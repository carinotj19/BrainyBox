import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function HistoryPage() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view your history.");
      return;
    }

    axios
      .get("http://localhost:4000/api/results/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setResults(res.data))
      .catch(() => setError("Failed to load results."));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-slate-100 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full bg-white p-6 rounded-xl shadow-md"
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          📜 Your Quiz History
        </h1>

        {error && (
          <p className="text-red-600 text-center font-medium">{error}</p>
        )}

        {!error && results.length === 0 && (
          <p className="text-gray-600 text-center">No results yet.</p>
        )}

        <ul className="space-y-4">
          <AnimatePresence>
            {results.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-blue-800">
                    {r.category} · {r.difficulty.toUpperCase()}
                  </span>
                  <span className="text-gray-500">
                    {new Date(r.createdAt || r.date).toLocaleString()}
                  </span>
                </div>
                <div className="text-gray-700">
                  Score:{" "}
                  <strong>
                    {r.score}/{r.total}
                  </strong>{" "}
                  (
                  {Math.round((r.score / r.total) * 100)}
                  %)
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    </div>
  );
}

export default HistoryPage;
