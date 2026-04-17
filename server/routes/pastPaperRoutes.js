const express = require('express');
const db = require('../config/db');
const router = express.Router();

// GET /api/past-papers?subject_id=1&year=2023
router.get('/', (req, res) => {
  const { subject_id, year } = req.query;
  let sql = `
    SELECT pp.*, s.name AS subject_name
    FROM past_papers pp
    JOIN subjects s ON pp.subject_id = s.id
    WHERE 1=1
  `;
  const params = [];
  if (subject_id) { sql += ' AND pp.subject_id = ?'; params.push(subject_id); }
  if (year)       { sql += ' AND pp.year = ?';       params.push(year); }
  sql += ' ORDER BY pp.year DESC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
