const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/:subjectId', (req, res) => {
  db.query(
    'SELECT * FROM topics WHERE subject_id = ? ORDER BY id',
    [req.params.subjectId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

module.exports = router;
