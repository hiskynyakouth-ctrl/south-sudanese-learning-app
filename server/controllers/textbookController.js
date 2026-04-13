const db = require('../config/db');

exports.getTextbooks = (req, res) => {
  const { subjectId } = req.query;
  const sql = subjectId
    ? 'SELECT t.*, s.name AS subject_name FROM textbooks t JOIN subjects s ON t.subject_id = s.id WHERE t.subject_id = ?'
    : 'SELECT t.*, s.name AS subject_name FROM textbooks t JOIN subjects s ON t.subject_id = s.id ORDER BY s.name, t.grade';
  const params = subjectId ? [subjectId] : [];
  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getTextbook = (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT t.*, s.name AS subject_name FROM textbooks t JOIN subjects s ON t.subject_id = s.id WHERE t.id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results[0]) return res.status(404).json({ error: 'Textbook not found' });
      res.json(results[0]);
    }
  );
};
