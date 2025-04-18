import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
  const [loadedFromSession, setLoadedFromSession] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const amount = params.get("amount");
    const category = params.get("category");
    const difficulty = params.get("difficulty");
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

    const resume = params.get("resume") === "true";
    const saved = sessionStorage.getItem("quizState");
    if (!resume && saved) {
      navigate("/quiz?resume=true", { replace: true });
      return;
    }
    if (resume && saved) {
      const parsed = JSON.parse(saved);
      setQuestions(parsed.questions);
      setCurrent(parsed.current);
      setScore(parsed.score);
      setSelected(parsed.selected);
      setTimer(parsed.timer);
      setShowResult(parsed.showResult);
      setAnswers(shuffleAnswers(parsed.questions[parsed.current])); // ✅ Key line
      setLoadedFromSession(true);
      return;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        sessionStorage.removeItem("quizState");
        if (data.results.length === 0) {
          setQuestions(null);
        } else {
          setQuestions(data.results);
          setAnswers(shuffleAnswers(data.results[0]));
          setLoadedFromSession(true);
        }
      })
      .catch(() => setQuestions(null));
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

  useEffect(() => {
    if (!questions.length || !loadedFromSession) return;

    const state = {
      questions,
      current,
      score,
      answers,
      selected,
      timer,
      showResult,
    };
    sessionStorage.setItem("quizState", JSON.stringify(state));
  }, [
    questions,
    current,
    score,
    answers,
    selected,
    timer,
    showResult,
    loadedFromSession,
  ]);

  useEffect(() => {
    if (showResult) {
      sessionStorage.removeItem("quizState");
    }
  }, [showResult]);

  function shuffleAnswers(question) {
    const all = [...question.incorrect_answers, question.correct_answer];
    return all.sort(() => Math.random() - 0.5).map(decodeHtml);
  }

  const handleAnswer = (choice) => {
    setSelected(choice);
    const isCorrect = choice === questions[current].correct_answer;
    if (isCorrect) setScore((prev) => prev + 1);
  };

  const nextQuestion = async () => {
    const next = current + 1;
    const token = localStorage.getItem("token");

    if (next < questions.length) {
      setCurrent(next);
      setAnswers(shuffleAnswers(questions[next]));
      setSelected(null);
      setTimer(15);
    } else {
      if (token) {
        try {
          await axios.post(
            "http://localhost:4000/api/results",
            {
              score,
              total: questions.length,
              category: questions[current].category,
              difficulty: questions[current].difficulty,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (err) {
          console.error("Failed to save result:", err.message);
        }
      }
      setShowResult(true);
    }
  };

  if (questions === null) {
    return (
      <div className="text-center mt-10 text-red-600">
        Failed to load questions.{" "}
        <button
          className="text-blue-600 underline"
          onClick={() => navigate("/")}
        >
          Go back
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="text-center mt-10 text-lg">Loading questions...</div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-sky-100 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <h1 className="text-2xl font-bold mb-3">🎉 Quiz Complete</h1>
          <p className="text-lg mb-4">
            You scored <span className="font-semibold">{score}</span> out of{" "}
            {questions.length}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }
  if (!questions[current]) {
    return (
      <div className="text-center mt-10 text-red-600">
        Invalid question state.
      </div>
    );
  }
  const q = questions[current];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-100 p-4">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="bg-white shadow-xl rounded-xl p-6 max-w-2xl w-full space-y-6 animate-fade-in"
      >
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 font-medium">
            {q.difficulty.toUpperCase()}
          </span>
          <span className="font-mono">⏱ {timer}s</span>
        </div>

        <h2 className="text-lg font-bold">{decodeHtml(q.question)}</h2>

        <div className="space-y-3">
          {answers.map((ans, i) => {
            const isSelected = selected === ans;
            const isCorrect = ans === q.correct_answer;
            let base =
              "w-full text-left px-4 py-2 rounded border font-medium transition";

            let color = "bg-white hover:bg-blue-50 border-gray-200";
            if (selected) {
              if (isCorrect) color = "bg-green-100 border-green-400";
              else if (isSelected)
                color = "bg-red-100 border-red-400 text-red-800";
              else color = "bg-gray-100 border-gray-200 text-gray-500";
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
      </motion.div>
    </div>
  );
}

export default QuizPage;
