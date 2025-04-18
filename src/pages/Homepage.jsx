import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category: "",
    difficulty: "easy",
    amount: 5,
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => setCategories(data.trivia_categories))
      .catch((err) => console.error("Failed to load categories", err));
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl w-full max-w-md p-6 space-y-6 animate-fade-in"
      >
        <h1 className="text-2xl font-bold text-center text-blue-800">
          🧠 BrainyBox
        </h1>

        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
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
          <label className="block font-medium mb-1 text-gray-700">
            Difficulty
          </label>
          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-700">
            Number of Questions
          </label>
          <input
            type="number"
            name="amount"
            min="1"
            max="50"
            value={form.amount}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Start Quiz
        </button>

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
          <div className="text-sm text-center text-gray-700">
            Logged in as <span className="font-medium">{user.username}</span>.{" "}
            <div className="flex justify-center">
              <Link
                to="/history"
                className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-2"
              >
                <span>📜</span> View My Quiz History
              </Link>
            </div>
            <button
              className="text-red-600 hover:underline ml-1"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default HomePage;
