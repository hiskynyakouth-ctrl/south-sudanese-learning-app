const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

// Serve uploaded files as static
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
