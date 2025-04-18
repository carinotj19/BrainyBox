/* eslint-disable no-unused-vars */
import express from "express";
import Result from "../models/Result.js";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// POST /api/results — Save quiz result
router.post("/", authenticate, async (req, res) => {
  try {
    const result = new Result({
      ...req.body,
      user: req.user.id,
    });

    await result.save();
    res.status(201).json({ message: "Result saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save result" });
  }
});

// GET /api/results — Fetch all results (admin/debug use)
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// GET /api/results/my — Get current user's results
router.get("/my", authenticate, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user results" });
  }
});

// GET /api/results/leaderboard — Top 5 per difficulty
router.get("/leaderboard", async (_req, res) => {
  try {
    const difficulties = ["easy", "medium", "hard"];
    const leaderboard = {};

    for (const difficulty of difficulties) {
      const aggregated = await Result.aggregate([
        { $match: { difficulty } },
        {
          $group: {
            _id: "$user",
            totalCorrect: { $sum: "$score" },
            totalQuestions: { $sum: "$total" },
          },
        },
        { $sort: { totalCorrect: -1 } },
        { $limit: 5 },
      ]);

      leaderboard[difficulty] = await Promise.all(
        aggregated.map(async (entry) => {
          const user = await User.findById(entry._id).select("username");
          return {
            username: user?.username || "Unknown",
            totalCorrect: entry.totalCorrect,
            totalQuestions: entry.totalQuestions,
          };
        })
      );
    }

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate leaderboard" });
  }
});

export default router;