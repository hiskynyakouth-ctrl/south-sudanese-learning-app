const { query } = require('../config/db');

exports.getSubjects = async (req, res) => {
  try {
    const { grade_id, stream_id } = req.query;
    let sql = 'SELECT * FROM subjects WHERE 1=1';
    const params = [];
    if (grade_id) { params.push(Number(grade_id)); sql += ` AND grade_id=$${params.length}`; }
    if (typeof stream_id !== 'undefined') {
      if (stream_id === '' || stream_id === 'null') sql += ' AND stream_id IS NULL';
      else { params.push(Number(stream_id)); sql += ` AND stream_id=$${params.length}`; }
    }
    sql += ' ORDER BY grade_id,name';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getSubject = async (req, res) => {
  try {
    const result = await query('SELECT * FROM subjects WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Subject not found.' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
