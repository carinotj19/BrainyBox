import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: Number,
  total: Number,
  category: String,
  difficulty: String,
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Result", resultSchema);
