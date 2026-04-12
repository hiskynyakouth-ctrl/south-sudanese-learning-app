const db = require("../config/db");

exports.getQuiz = (req, res) => {
  const { chapterId } = req.params;

  db.query("SELECT * FROM quizzes WHERE chapter_id = ? ORDER BY id", [chapterId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    return res.json(
      results.map((quiz) => ({
        ...quiz,
        options: typeof quiz.options === "string" ? JSON.parse(quiz.options) : quiz.options,
      }))
    );
  });
};

exports.submitQuiz = (req, res) => {
  const { chapterId } = req.params;
  const { answers = [] } = req.body;

  db.query("SELECT * FROM quizzes WHERE chapter_id = ? ORDER BY id", [chapterId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const review = results.map((quiz) => {
      const submitted = answers.find((item) => String(item.id) === String(quiz.id));
      const selected = submitted?.answer ?? null;

      return {
        id: quiz.id,
        question: quiz.question,
        selected,
        correctAnswer: quiz.answer,
        correct: selected === quiz.answer,
      };
    });

    return res.json({
      total: results.length,
      score: review.filter((item) => item.correct).length,
      review,
    });
  });
};
