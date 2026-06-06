const { query } = require('../config/db');

exports.getChaptersBySubject = async (req, res) => {
  try {
    const chapters = await query(
      'SELECT * FROM chapters WHERE subject_id = $1 ORDER BY created_at',
      [req.params.subjectId]
    );
    const quizCounts = await query(
      'SELECT chapter_id, COUNT(*) AS cnt FROM quizzes WHERE chapter_id = ANY($1) GROUP BY chapter_id',
      [chapters.rows.map(c => c.id)]
    );
    const countMap = {};
    quizCounts.rows.forEach(r => { countMap[r.chapter_id] = parseInt(r.cnt); });

    res.json(chapters.rows.map(ch => ({
      id: ch.id,
      title: ch.title,
      content: ch.content,
      video_url: ch.video_url,
      quiz_count: countMap[ch.id] || 0,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChapter = async (req, res) => {
  try {
    const chResult = await query('SELECT * FROM chapters WHERE id = $1', [req.params.id]);
    if (!chResult.rows.length) return res.status(404).json({ error: 'Chapter not found.' });
    const chapter = chResult.rows[0];

    const questions = await query(
      'SELECT * FROM chapter_questions WHERE chapter_id = $1', [chapter.id]
    );
    const quiz = await query(
      'SELECT * FROM quizzes WHERE chapter_id = $1', [chapter.id]
    );

    res.json({
      chapter,
      questions: questions.rows,
      quizCount: quiz.rows.length,
      quizPreview: quiz.rows.slice(0, 3),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
