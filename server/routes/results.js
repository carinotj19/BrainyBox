import express from "express";
import Result from "../models/Result.js";
import { authenticate } from "../middleware/auth.js";
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

export default router;
