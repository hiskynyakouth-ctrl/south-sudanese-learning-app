const express = require("express");
const cors    = require("cors");
const path    = require("path");
require("dotenv").config();

const app = express();

// ── CORS ─────────────────────────────────────────────────
app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE","OPTIONS","PATCH"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health check (always works, no DB needed) ────────────
app.get("/",     (req, res) => res.json({ status: "ok", message: "South Sudan E-Learning API" }));
app.get("/api",  (req, res) => res.json({ status: "ok", message: "South Sudan E-Learning API v1" }));
app.get("/health", (req, res) => res.json({ status: "ok" }));

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth",        require("./routes/authRoutes"));
app.use("/api/subjects",    require("./routes/subjectRoutes"));
app.use("/api/chapters",    require("./routes/chapterRoutes"));
app.use("/api/quizzes",     require("./routes/quizRoutes"));
app.use("/api/chat",        require("./routes/chatRoutes"));
app.use("/api/textbooks",   require("./routes/textbookRoutes"));
app.use("/api/grades",      require("./routes/gradeRoutes"));
app.use("/api/topics",      require("./routes/topicRoutes"));
app.use("/api/past-papers", require("./routes/pastPaperRoutes"));
app.use("/api/admin",       require("./routes/adminRoutes"));
app.use("/api/upload",      require("./routes/uploadRoutes"));

// ── Static uploads ────────────────────────────────────────
app.use("/uploads", (req, res, next) => {
  res.setHeader("Content-Disposition", "inline");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
}, express.static(path.join(__dirname, "uploads")));

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ── Start server ──────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Database: ${process.env.DATABASE_URL ? "Render PostgreSQL" : process.env.DB_NAME || "local"}`);
});

// ── Initialize DB schema (non-blocking) ──────────────────
const { pool } = require("./config/db");
const DB_INIT = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS grades (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS streams (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS subjects (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, grade_id INT, stream_id INT)`,
  `CREATE TABLE IF NOT EXISTS topics (id SERIAL PRIMARY KEY, name VARCHAR(150) NOT NULL, subject_id INT)`,
  `CREATE TABLE IF NOT EXISTS chapters (id SERIAL PRIMARY KEY, subject_id INT, title VARCHAR(255) NOT NULL, content TEXT)`,
  `CREATE TABLE IF NOT EXISTS quizzes (id SERIAL PRIMARY KEY, chapter_id INT, title VARCHAR(255) NOT NULL, questions JSONB)`,
  `CREATE TABLE IF NOT EXISTS past_papers (id SERIAL PRIMARY KEY, subject_id INT, year INT, file_url TEXT, title VARCHAR(255))`,
  `CREATE TABLE IF NOT EXISTS textbooks (id SERIAL PRIMARY KEY, subject_id INT, title VARCHAR(255) NOT NULL, author VARCHAR(255), grade VARCHAR(50), url TEXT)`,
];

(async () => {
  try {
    for (const sql of DB_INIT) await pool.query(sql);
    console.log("Database schema ready.");
  } catch (err) {
    console.error("DB init warning:", err.message);
  }
})();
