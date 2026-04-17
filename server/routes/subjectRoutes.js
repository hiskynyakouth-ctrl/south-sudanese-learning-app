const express = require('express');
const { getSubjects, getSubject } = require('../controllers/subjectController');
const db = require('../config/db');
const router = express.Router();

// GET /api/subjects?grade_id=3&stream_id=1
router.get('/', (req, res) => {
  const { grade_id, stream_id } = req.query;
  if (grade_id) {
    let sql = 'SELECT * FROM subjects WHERE grade_id = ?';
    const params = [grade_id];
    if (stream_id) { sql += ' AND stream_id = ?'; params.push(stream_id); }
    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  } else {
    getSubjects(req, res);
  }
});

router.get('/:id', getSubject);

module.exports = router;
