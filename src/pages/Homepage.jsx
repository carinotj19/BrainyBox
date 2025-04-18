import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LeaderboardWidget from "../components/LeaderboardWidget";
import { motion } from "framer-motion";

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category: "",
    difficulty: "easy",
    amount: 5,
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const hasSavedQuiz = !!sessionStorage.getItem("quizState");

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => setCategories(data.trivia_categories))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(
      `/quiz?amount=${form.amount}&category=${form.category}&difficulty=${form.difficulty}`
    );
  };

  return (
    <>
      <LeaderboardWidget />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100 px-4 py-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md space-y-5"
        >
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
            🧠 BrainyBox
          </h1>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Number of Questions
            </label>
            <input
              type="number"
              name="amount"
              min="1"
              max="50"
              value={form.amount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Start Quiz
          </button>
          <hr className="mt-4 mb-2 border-gray-200" />
          {hasSavedQuiz && (
            <div className="text-sm text-center mt-1 space-y-1">
              <p className="text-gray-600">You have a quiz in progress.</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate("/quiz?resume=true")}
                  className="text-blue-600 hover:underline"
                >
                  Resume
                </button>
                <button
                  onClick={() => {
                    sessionStorage.removeItem("quizState");
                    window.location.reload();
                  }}
                  className="text-red-600 hover:underline"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          {!user ? (
            <div className="text-sm text-center text-gray-600">
              Want to save your progress?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register here
              </Link>
              <br />
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </div>
          ) : (
            <>
              <div className="text-sm text-center text-gray-700">
                Logged in as{" "}
                <span className="font-medium">{user.username}</span>.
              </div>

              <div className="flex justify-center">
                <Link
                  to="/history"
                  className="text-blue-600 hover:underline text-sm mt-2"
                >
                  📜 View My Quiz History
                </Link>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    window.location.reload();
                  }}
                  className="text-red-600 hover:underline text-sm mt-1"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </motion.form>
      </div>
    </>
  );
}

export default HomePage;
