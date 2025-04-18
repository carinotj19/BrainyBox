import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import resultRoutes from "./routes/results.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/brainybox", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/results", resultRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
