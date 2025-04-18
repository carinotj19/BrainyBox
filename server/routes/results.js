import express from "express";
import Result from "../models/Result.js";
import { authenticate } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const result = new Result({
      ...req.body,
      user: req.user.id
    });
    await result.save();
    res.status(201).json({ message: "Result saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const results = await Result.find().sort({ date: -1 });
  res.json(results);
});

router.get("/my", authenticate, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id }).sort({ date: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const difficulties = ["easy", "medium", "hard"];
    const leaderboard = {};

    for (let diff of difficulties) {
      const entries = await Result.aggregate([
        { $match: { difficulty: diff } },
        {
          $group: {
            _id: "$user",
            totalCorrect: { $sum: "$score" },
            totalQuestions: { $sum: "$total" }
          }
        },
        { $sort: { totalCorrect: -1 } },
        { $limit: 5 }
      ]);
      leaderboard[diff] = await Promise.all(
        entries.map(async (entry) => {
          const user = await User.findById(entry._id).select("username");
          return {
            username: user?.username || "Unknown",
            totalCorrect: entry.totalCorrect,
            totalQuestions: entry.totalQuestions
          };
        })
      );
    }

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
