import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { apiUrl, isDemo } from "../services/api";
import { demoLeaderboard } from "../services/demoData";

function LeaderboardWidget() {
  const [data, setData] = useState({ easy: [], medium: [], hard: [] });
  const [activeTab, setActiveTab] = useState("easy");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (isDemo) {
      setData(demoLeaderboard);
      return;
    }

    fetch(apiUrl("/api/results/leaderboard"))
      .then(res => res.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const renderList = (list) => {
    const medals = ["🥇", "🥈", "🥉"];

    return (
      <ul className="space-y-1">
        {list.map((entry, index) => {
          const rankIcon = medals[index] || `${index + 1}.`;
          const isCurrent = currentUser?.username === entry.username;

          return (
            <li
              key={index}
              className={`flex justify-between items-center px-2 py-1 rounded-md transition ${
                isCurrent ? "font-bold text-blue-600 bg-blue-50" : "hover:bg-gray-100"
              }`}
            >
              <span className="truncate max-w-[120px]">
                {rankIcon} {entry.username}
              </span>
              <span className="text-right font-mono tabular-nums text-sm">
                {entry.totalCorrect}/{entry.totalQuestions} (
                {Math.round((entry.totalCorrect / entry.totalQuestions) * 100) || 0}%)
              </span>
            </li>
          );
        })}
        {list.length === 0 && (
          <li className="text-sm text-gray-500 italic text-center">No entries yet</li>
        )}
      </ul>
    );
  };

  const tabClass = (tab) =>
    `px-3 py-1 text-sm rounded-md transition-all duration-200 font-medium ${
      activeTab === tab
        ? "bg-blue-600 text-white shadow"
        : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-100"
    }`;

  return (
    <div className="absolute top-4 right-4 w-80 bg-white shadow-xl rounded-xl p-4 animate-fade-in">
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">🏆 Top by Difficulty</h2>

      <div className="flex justify-between mb-3">
        <button onClick={() => setActiveTab("easy")} className={tabClass("easy")}>Easy</button>
        <button onClick={() => setActiveTab("medium")} className={tabClass("medium")}>Medium</button>
        <button onClick={() => setActiveTab("hard")} className={tabClass("hard")}>Hard</button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderList(data[activeTab] || [])}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default LeaderboardWidget;
