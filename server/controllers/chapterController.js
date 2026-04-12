const db = require("../config/db");

exports.getChapters = (req, res) => {
  const { subjectId } = req.params;

  db.query(
    `SELECT c.*, COUNT(q.id) AS quiz_count
     FROM chapters c
     LEFT JOIN quizzes q ON q.chapter_id = c.id
     WHERE c.subject_id = ?
     GROUP BY c.id
     ORDER BY c.id`,
    [subjectId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      return res.json(results);
    }
  );
};

exports.getChapter = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM chapters WHERE id = ?", [id], (chapterErr, chapterResults) => {
    if (chapterErr) {
      return res.status(500).json({ error: chapterErr.message });
    }

    if (chapterResults.length === 0) {
      return res.status(404).json({ error: "Chapter not found." });
    }

    db.query(
      "SELECT id, question, answer FROM discussion_questions WHERE chapter_id = ? ORDER BY id",
      [id],
      (questionErr, questionResults) => {
        if (questionErr) {
          return res.status(500).json({ error: questionErr.message });
        }

        db.query(
          "SELECT id, question FROM quizzes WHERE chapter_id = ? ORDER BY id",
          [id],
          (quizErr, quizResults) => {
            if (quizErr) {
              return res.status(500).json({ error: quizErr.message });
            }

            return res.json({
              chapter: chapterResults[0],
              questions: questionResults,
              quizCount: quizResults.length,
              quizPreview: quizResults,
            });
          }
        );
      }
    );
  });
};
