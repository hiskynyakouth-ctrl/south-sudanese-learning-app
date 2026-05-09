// Vercel Serverless — Express app entry point
const express = require("express");
const cors    = require("cors");
const path    = require("path");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE","OPTIONS","PATCH"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth",        require("../server/routes/authRoutes"));
app.use("/api/subjects",    require("../server/routes/subjectRoutes"));
app.use("/api/chapters",    require("../server/routes/chapterRoutes"));
app.use("/api/quizzes",     require("../server/routes/quizRoutes"));
app.use("/api/chat",        require("../server/routes/chatRoutes"));
app.use("/api/textbooks",   require("../server/routes/textbookRoutes"));
app.use("/api/grades",      require("../server/routes/gradeRoutes"));
app.use("/api/topics",      require("../server/routes/topicRoutes"));
app.use("/api/past-papers", require("../server/routes/pastPaperRoutes"));
app.use("/api/admin",       require("../server/routes/adminRoutes"));
app.use("/api/upload",      require("../server/routes/uploadRoutes"));

// Health check
app.get("/api", (req, res) => res.json({ status: "ok", message: "South Sudan E-Learning API" }));

module.exports = app;
