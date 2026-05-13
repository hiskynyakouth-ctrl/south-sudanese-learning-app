const express = require("express");
const cors    = require("cors");
const path    = require("path");

// Load env
try { require("dotenv").config(); } catch(e) {}

const app = express();

// ── CORS — allow everything ───────────────────────────────
app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE","OPTIONS","PATCH"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ── Health / debug (always works) ────────────────────────
app.get("/",        (req, res) => res.json({ status: "ok", message: "South Sudan E-Learning API" }));
app.get("/health",  (req, res) => res.json({ status: "ok" }));
app.get("/api",     (req, res) => res.json({ status: "ok", version: "2.1" }));
app.get("/debug",   (req, res) => res.json({
  status: "ok", version: "2.1",
  env: process.env.NODE_ENV || "development",
  hasDB: !!process.env.DATABASE_URL,
  hasJWT: !!process.env.JWT_SECRET,
  port: process.env.PORT || 5001,
  loadedRoutes: loadedRoutes,
  failedRoutes: failedRoutes,
}));

// ── Safe route loader ─────────────────────────────────────
const loadedRoutes = [];
const failedRoutes = [];

function safeRoute(mountPath, routeFile) {
  try {
    const router = require(routeFile);
    app.use(mountPath, router);
    loadedRoutes.push(mountPath);
    console.log(`✅ Route loaded: ${mountPath}`);
  } catch (err) {
    failedRoutes.push({ path: mountPath, error: err.message });
    console.error(`❌ Route failed: ${mountPath} — ${err.message}`);
    // Mount a fallback so the path returns a useful error instead of 404
    app.use(mountPath, (req, res) => res.status(503).json({ error: `Route unavailable: ${err.message}` }));
  }
}

// ── Load all routes ───────────────────────────────────────
safeRoute("/api/auth",        "./routes/authRoutes");
safeRoute("/api/subjects",    "./routes/subjectRoutes");
safeRoute("/api/chapters",    "./routes/chapterRoutes");
safeRoute("/api/quizzes",     "./routes/quizRoutes");
safeRoute("/api/chat",        "./routes/chatRoutes");
safeRoute("/api/textbooks",   "./routes/textbookRoutes");
safeRoute("/api/grades",      "./routes/gradeRoutes");
safeRoute("/api/topics",      "./routes/topicRoutes");
safeRoute("/api/past-papers", "./routes/pastPaperRoutes");
safeRoute("/api/admin",       "./routes/adminRoutes");
safeRoute("/api/upload",      "./routes/uploadRoutes");

// ── Static uploads ────────────────────────────────────────
try {
  const uploadsDir = path.join(__dirname, "uploads");
  require("fs").mkdirSync(uploadsDir, { recursive: true });
  app.use("/uploads", (req, res, next) => {
    res.setHeader("Content-Disposition", "inline");
    next();
  }, express.static(uploadsDir));
} catch(e) { console.error("Uploads dir error:", e.message); }

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.path}`, loadedRoutes });
});

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: err.message });
});

// ── Start server ──────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? "Render PostgreSQL ✅" : process.env.DB_NAME || "local"}`);
  console.log(`✅ Loaded routes: ${loadedRoutes.join(", ")}`);
  if (failedRoutes.length) console.error(`❌ Failed routes: ${failedRoutes.map(r=>r.path).join(", ")}`);
});

// ── Init DB schema (non-blocking) ────────────────────────
setTimeout(async () => {
  try {
    const { pool } = require("./config/db");
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(20) DEFAULT 'student', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
      `CREATE TABLE IF NOT EXISTS grades (id SERIAL PRIMARY KEY, name VARCHAR(50))`,
      `CREATE TABLE IF NOT EXISTS subjects (id SERIAL PRIMARY KEY, name VARCHAR(100), grade_id INT)`,
      `CREATE TABLE IF NOT EXISTS chapters (id SERIAL PRIMARY KEY, subject_id INT, title VARCHAR(255), content TEXT)`,
      `CREATE TABLE IF NOT EXISTS quizzes (id SERIAL PRIMARY KEY, chapter_id INT, title VARCHAR(255), questions JSONB)`,
      `CREATE TABLE IF NOT EXISTS past_papers (id SERIAL PRIMARY KEY, subject_id INT, year INT, file_url TEXT, title VARCHAR(255))`,
      `CREATE TABLE IF NOT EXISTS textbooks (id SERIAL PRIMARY KEY, subject_id INT, title VARCHAR(255), grade VARCHAR(50), url TEXT)`,
    ];
    for (const sql of tables) await pool.query(sql).catch(()=>{});
    console.log("✅ Database schema ready.");
  } catch(err) {
    console.error("⚠️  DB init error:", err.message);
  }
}, 1000);
