const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/chapters', require('./routes/chapterRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});