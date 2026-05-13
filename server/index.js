const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { pool } = require("./config/db");

const app = express();

// Allow localhost dev + Vercel production frontend
const allowedOrigins = [
  "http://localhost:3002",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  "https://south-sudanese-learning-app.vercel.app",
  "https://south-sudanese-learning-app-1.onrender.com",
  /\.vercel\.app$/,
  /\.onrender\.com$/,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      const allowed = allowedOrigins.some(o =>
        typeof o === "string" ? o === origin : o.test(origin)
      );
      callback(null, allowed ? origin : false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// ── Initialize database schema on startup ────────────────
async function initializeDatabase() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS grades (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS streams (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS subjects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      grade_id INT,
      stream_id INT
    )`,
    `CREATE TABLE IF NOT EXISTS topics (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      subject_id INT
    )`,
    `CREATE TABLE IF NOT EXISTS chapters (
      id SERIAL PRIMARY KEY,
      subject_id INT,
      title VARCHAR(255) NOT NULL,
      content TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS quizzes (
      id SERIAL PRIMARY KEY,
      chapter_id INT,
      title VARCHAR(255) NOT NULL,
      questions JSONB
    )`,
    `CREATE TABLE IF NOT EXISTS past_papers (
      id SERIAL PRIMARY KEY,
      subject_id INT,
      year INT,
      file_url TEXT,
      title VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS textbooks (
      id SERIAL PRIMARY KEY,
      subject_id INT,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255),
      grade VARCHAR(50),
      url TEXT
    )`
  ];

  try {
    console.log("Initializing database schema...");
    for (const statement of statements) {
      await pool.query(statement);
    }
    console.log("Database schema initialized successfully.");
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
}

// Initialize database before starting server
initializeDatabase().then(() => {
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/subjects", require("./routes/subjectRoutes"));
  app.use("/api/chapters", require("./routes/chapterRoutes"));
  app.use("/api/quizzes", require("./routes/quizRoutes"));
  app.use("/api/chat", require("./routes/chatRoutes"));
  app.use("/api/textbooks", require("./routes/textbookRoutes"));
  app.use("/api/grades", require("./routes/gradeRoutes"));
  app.use("/api/topics", require("./routes/topicRoutes"));
  app.use("/api/past-papers", require("./routes/pastPaperRoutes"));
  app.use("/api/admin", require("./routes/adminRoutes"));
  app.use("/api/upload", require("./routes/uploadRoutes"));

  // Serve uploaded files as static — read-only, no download
  const path = require("path");
  app.use("/uploads", (req, res, next) => {
    // Block direct file downloads — only allow viewing
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
  }, express.static(path.join(__dirname, "uploads")));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize database:", err.message);
  process.exit(1);
});
