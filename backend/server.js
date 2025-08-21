import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // allow React frontend
app.use(express.json()); // parse JSON requests

// PostgreSQL setup
const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test route
app.get("/", (req, res) => {
  res.send("Survey backend is running!");
});

// POST /survey - Save survey data
app.post("/survey", async (req, res) => {
  try {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10 } = req.body;

  const query = `
  INSERT INTO survey_responses 
  (q1,q2,q3,q4,q5,q6,q7,q8,q9,q10)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
  RETURNING *;
`;


    const values = [
  q1, // just the array, e.g., ["Option A","Option B"]
  q2,
  q3,
  q4,
  q5,
  q6,
  q7,
  q8,
  q9,
  q10,
];

    const result = await pool.query(query, values);
    res.status(201).json({ message: "Survey saved", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save survey" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
