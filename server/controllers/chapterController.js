const Chapter = require('../models/chapterModel');

exports.getChaptersBySubject = async (req, res) => {
  try {
    const chapters = await Chapter.find({ subjectId: req.params.subjectId }).sort({ createdAt: 1 });
    
    res.json(chapters.map(ch => ({
      id: ch._id,
      title: ch.title,
      content: ch.content,
      video_url: ch.video_url,
      quiz_count: ch.quiz ? ch.quiz.length : 0,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found.' });
    
    const formattedChapter = {
      id: chapter._id,
      subject_id: chapter.subjectId,
      title: chapter.title,
      content: chapter.content,
      video_url: chapter.video_url,
      created_at: chapter.createdAt
    };

    res.json({
      chapter: formattedChapter,
      questions: chapter.questions.map(q => ({ id: q._id, question: q.question, answer: q.answer })),
      quizCount: chapter.quiz ? chapter.quiz.length : 0,
      quizPreview: chapter.quiz ? chapter.quiz.slice(0, 3) : [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
