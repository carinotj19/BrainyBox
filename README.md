# 🧠 BrainyBox – Full Stack Trivia Quiz App

BrainyBox is a full stack trivia quiz app where users can take quizzes from a wide range of categories and difficulties using real-time data from the Open Trivia DB. It features persistent quiz progress, user accounts, history tracking, and a live leaderboard.

---

## ✨ Features

- ✅ Select quiz category, difficulty, and number of questions
- ✅ Answer multiple choice questions with live score tracking
- ✅ Save results to user history
- ✅ Resume unfinished quizzes (session-based persistence)
- ✅ View quiz history with stats
- ✅ Global leaderboard (with medals + tabs for each difficulty)
- ✅ Clean responsive UI with smooth transitions

---

## 🛠️ Tech Stack

| Layer     | Stack                        |
|-----------|------------------------------|
| Frontend  | React + Vite + Tailwind CSS  |
| Backend   | Node.js + Express + MongoDB  |
| Auth      | JWT-based with local storage |
| API       | [Open Trivia DB](https://opentdb.com/) |

---

## 🚀 Setup

```bash
git clone https://github.com/carinotj19/brainybox.git
cd brainybox

# install frontend deps
npm install

# install backend deps
cd server
npm install

# start backend
npm run start

# go back to frontend and start
cd ..
npm run dev
```

** ✅ Make sure MongoDB is running locally or set MONGO_URI in a .env file inside /server **

## 📌 Project Roadmap

- [x] Frontend UI with category & difficulty selection
- [x] API integration with Open Trivia DB
- [x] User authentication (JWT-based)
- [x] Quiz result saving
- [x] Resume quiz progress (session persistence)
- [x] Quiz history page
- [x] Leaderboard with difficulty tabs and medals
- [x] Smooth UI animations and polish
- [ ] Admin dashboard for result moderation _(planned)_
- [ ] User-created quizzes and custom sets _(planned)_

## License

MIT

---
