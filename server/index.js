const express = require("express");
const cors = require("cors");
require("dotenv").config();

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
