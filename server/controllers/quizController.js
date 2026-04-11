const db = require('../config/db');

exports.getQuiz = (req, res) => {
  const { chapterId } = req.params;
  db.query('SELECT * FROM quizzes WHERE chapter_id = ?', [chapterId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.submitQuiz = (req, res) => {
  // Logic to submit quiz answers
  res.json({ message: 'Quiz submitted' });
};