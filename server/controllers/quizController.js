const Chapter = require('../models/chapterModel');

exports.getQuiz = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId).select('title quiz');
    if (!chapter) return res.status(404).json({ error: 'Chapter not found.' });

    const formattedQuiz = (chapter.quiz || []).map(q => ({
      id: q._id,
      question: q.question,
      options: q.options,
      correct_answer: q.answer
    }));

    res.json({
      chapterTitle: chapter.title,
      questions: formattedQuiz,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
