const express = require("express");
const cors    = require("cors");
const path    = require("path");

// Load env from server/.env
require("dotenv").config({ path: path.join(__dirname, "../server/.env") });

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET","POST","PUT","DELETE","OPTIONS","PATCH"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const r = path.join(__dirname, "../server/routes");
app.use("/api/auth",        require(r + "/authRoutes"));
app.use("/api/subjects",    require(r + "/subjectRoutes"));
app.use("/api/chapters",    require(r + "/chapterRoutes"));
app.use("/api/quizzes",     require(r + "/quizRoutes"));
app.use("/api/chat",        require(r + "/chatRoutes"));
app.use("/api/textbooks",   require(r + "/textbookRoutes"));
app.use("/api/grades",      require(r + "/gradeRoutes"));
app.use("/api/topics",      require(r + "/topicRoutes"));
app.use("/api/past-papers", require(r + "/pastPaperRoutes"));
app.use("/api/admin",       require(r + "/adminRoutes"));
app.use("/api/upload",      require(r + "/uploadRoutes"));

app.get("/api", (req, res) => res.json({ status: "ok", message: "South Sudan E-Learning API v1" }));

module.exports = app;
