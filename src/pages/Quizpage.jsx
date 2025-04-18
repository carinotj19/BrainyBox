import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function QuizPage() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const amount = params.get("amount");
    const category = params.get("category");
    const difficulty = params.get("difficulty");

    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.results);
        setAnswers(shuffleAnswers(data.results[0]));
      });
  }, [search]);

  useEffect(() => {
    if (!selected && questions.length > 0) {
      const countdown = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(countdown);
            setSelected("Time’s up");
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [current, selected, questions]);

  function shuffleAnswers(question) {
    const all = [...question.incorrect_answers, question.correct_answer];
    return all.sort(() => Math.random() - 0.5);
  }

  const handleAnswer = (choice) => {
    setSelected(choice);
    const isCorrect = choice === questions[current].correct_answer;
    if (isCorrect) setScore((prev) => prev + 1);
  };

  const nextQuestion = async () => {
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setAnswers(shuffleAnswers(questions[next]));
      setSelected(null);
      setTimer(15);
    } else {
      try {
        await axios.post("http://localhost:4000/api/results", {
          score,
          total: questions.length,
          category: questions[current].category,
          difficulty: questions[current].difficulty,
        });
      } catch (err) {
        console.error("Failed to save result:", err.message);
      }
      setShowResult(true);
    }
  };

  const getDifficultyColor = (level) => {
    return {
      easy: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      hard: "bg-red-100 text-red-700",
    }[level];
  };

  if (!questions.length) {
    return (
      <div className="text-center mt-10 text-lg">Loading questions...</div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="bg-white p-8 rounded-lg shadow-md text-center space-y-4">
          <h1 className="text-3xl font-bold">🎉 Quiz Complete!</h1>
          <p className="text-xl">
            Your Score: <span className="font-semibold">{score}</span> /{" "}
            {questions.length}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6 space-y-6 animate-fade-in">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span
            className={`px-3 py-1 rounded-full font-medium ${getDifficultyColor(
              q.difficulty
            )}`}
          >
            {q.difficulty.toUpperCase()}
          </span>
          <span className="font-mono text-gray-700">⏱ {timer}s</span>
        </div>

        <h2 className="text-lg font-bold">{decodeHtml(q.question)}</h2>

        <div className="space-y-3">
          {answers.map((ans, i) => {
            const isSelected = selected === ans;
            const isCorrect = ans === q.correct_answer;

            const base = "w-full text-left px-4 py-2 rounded border transition";
            let color = "bg-white hover:bg-blue-50 border-gray-200";
            if (selected) {
              if (isCorrect) color = "bg-green-100 border-green-400";
              else if (isSelected)
                color = "bg-red-100 border-red-400 text-red-800";
              else color = "bg-gray-100 border-gray-200";
            }

            return (
              <button
                key={i}
                onClick={() => !selected && handleAnswer(ans)}
                className={`${base} ${color}`}
                disabled={!!selected}
              >
                {decodeHtml(ans)}
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="text-right">
            <button
              onClick={nextQuestion}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
