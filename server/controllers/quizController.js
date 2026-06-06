const { query } = require('../config/db');

exports.getQuiz = async (req, res) => {
  try {
    const chResult = await query('SELECT title FROM chapters WHERE id = $1', [req.params.chapterId]);
    if (!chResult.rows.length) return res.status(404).json({ error: 'Chapter not found.' });

    const quiz = await query(
      'SELECT id, question, options, answer AS correct_answer FROM quizzes WHERE chapter_id = $1',
      [req.params.chapterId]
    );

    res.json({
      chapterTitle: chResult.rows[0].title,
      questions: quiz.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
