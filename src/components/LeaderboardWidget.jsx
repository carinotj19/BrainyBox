import { useEffect, useState } from "react";
import axios from "axios";

function LeaderboardWidget() {
  const [data, setData] = useState({ easy: [], medium: [], hard: [] });
  const [activeTab, setActiveTab] = useState("easy");

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/results/leaderboard")
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  const renderList = (list) => (
    <ul className="text-sm space-y-1 mt-2">
      {list.map((entry, index) => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const medals = ["🥇", "🥈", "🥉"];
        const rankIcon = medals[index] || `${index + 1}.`;

        return (
          <li
            key={index}
            className={`flex justify-between ${
              currentUser?.username === entry.username
                ? "font-bold text-blue-600"
                : ""
            }`}
          >
            <span className="truncate max-w-[100px]">
              {rankIcon} {entry.username}
            </span>
            <span className="tabular-nums text-right min-w-[70px]">
              {entry.totalCorrect}/{entry.totalQuestions} (
              {Math.round((entry.totalCorrect / entry.totalQuestions) * 100) ||
                0}
              % )
            </span>
          </li>
        );
      })}
    </ul>
  );

  const tabClass = (tab) =>
    `px-3 py-1 text-sm rounded cursor-pointer ${
      activeTab === tab
        ? "bg-blue-600 text-white"
        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
    }`;

  return (
    <div className="absolute top-4 right-4 w-72 bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-bold mb-2">🏆 Top by Difficulty</h2>

      <div className="flex justify-between mb-2">
        <button
          onClick={() => setActiveTab("easy")}
          className={tabClass("easy")}
        >
          Easy
        </button>
        <button
          onClick={() => setActiveTab("medium")}
          className={tabClass("medium")}
        >
          Medium
        </button>
        <button
          onClick={() => setActiveTab("hard")}
          className={tabClass("hard")}
        >
          Hard
        </button>
      </div>

      {renderList(data[activeTab] || [])}
    </div>
  );
}

export default LeaderboardWidget;
