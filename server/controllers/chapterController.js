const Chapter = require('../models/chapterModel');

exports.getChaptersBySubject = async (req, res) => {
  try {
    const chapters = await Chapter.find({ subjectId: req.params.subjectId })
      .select('title content video_url quiz')
      .sort({ createdAt: 1 });

    const result = chapters.map((ch) => ({
      id: ch._id,
      title: ch.title,
      content: ch.content,
      video_url: ch.video_url,
      quiz_count: ch.quiz.length,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found.' });

    res.json({
      chapter,
      questions: chapter.questions,
      quizCount: chapter.quiz.length,
      quizPreview: chapter.quiz.slice(0, 3),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
