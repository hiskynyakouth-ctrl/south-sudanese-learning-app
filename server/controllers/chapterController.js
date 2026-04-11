const db = require('../config/db');

exports.getChapters = (req, res) => {
  const { subjectId } = req.params;
  db.query('SELECT * FROM chapters WHERE subject_id = ?', [subjectId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getChapter = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM chapters WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};