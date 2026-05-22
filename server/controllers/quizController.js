const Chapter = require('../models/chapterModel');

exports.getQuiz = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.chapterId).select('quiz title');
    if (!chapter) return res.status(404).json({ error: 'Chapter not found.' });

    res.json({
      chapterTitle: chapter.title,
      questions: chapter.quiz,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
