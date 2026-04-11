const db = require('../config/db');

exports.getSubjects = (req, res) => {
  db.query('SELECT * FROM subjects', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getSubject = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM subjects WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};