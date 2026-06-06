const express = require('express');
const { query, getDbStatus } = require('../config/db');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();
router.use(adminMiddleware);

// DB check middleware
router.use((req, res, next) => {
  if (getDbStatus().state === 1) return next();
  return res.status(503).json({ error: 'Database is not connected. Check DATABASE_URL on the backend server.' });
});

const GRADE_MAP  = { 1: 'Senior 1', 2: 'Senior 2', 3: 'Senior 3', 4: 'Senior 4' };
const STREAM_MAP = { 1: 'Natural Sciences', 2: 'Social Sciences' };

const subjectPayload = (s) => ({
  id:          s.id,
  name:        s.name,
  description: s.description || '',
  grade_id:    s.grade_id,
  stream_id:   s.stream_id,
  grade_name:  GRADE_MAP[s.grade_id] || (s.grade_id ? `Grade ${s.grade_id}` : 'Unknown'),
  stream_name: s.stream_id ? STREAM_MAP[s.stream_id] || 'Core' : 'Core',
  icon:        s.icon || '📘',
  created_at:  s.created_at,
  updated_at:  s.updated_at,
});

// ── Stats ────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [users, subjects, chapters, papers] = await Promise.all([
      query('SELECT COUNT(*) FROM users'),
      query('SELECT COUNT(*) FROM subjects'),
      query('SELECT COUNT(*) FROM chapters'),
      query('SELECT COUNT(*) FROM past_papers'),
    ]);
    res.json({
      users:    parseInt(users.rows[0].count),
      subjects: parseInt(subjects.rows[0].count),
      chapters: parseInt(chapters.rows[0].count),
      papers:   parseInt(papers.rows[0].count),
      db: 'connected',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Users ────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['student', 'teacher', 'admin'].includes(role))
    return res.status(400).json({ error: 'Invalid role.' });
  try {
    await query('UPDATE users SET role = $1 WHERE id = $2', [role, req.params.id]);
    res.json({ message: 'Role updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Subjects ─────────────────────────────────────────────
router.get('/subjects', async (req, res) => {
  try {
    const result = await query('SELECT * FROM subjects ORDER BY grade_id, name');
    res.json(result.rows.map(subjectPayload));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/subjects', async (req, res) => {
  const { name, grade_id, stream_id, description } = req.body;
  try {
    const result = await query(
      `INSERT INTO subjects (name, description, grade_id, stream_id, updated_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [name, description || '', Number(grade_id) || 0, stream_id != null ? Number(stream_id) : null]
    );
    res.status(201).json(subjectPayload(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/subjects/:id', async (req, res) => {
  const { name, grade_id, stream_id, description } = req.body;
  try {
    const result = await query(
      `UPDATE subjects SET name=$1, description=$2, grade_id=$3, stream_id=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [name, description || '', Number(grade_id) || 0, stream_id != null ? Number(stream_id) : null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Subject not found.' });
    res.json(subjectPayload(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/subjects/:id', async (req, res) => {
  try {
    await query('DELETE FROM subjects WHERE id = $1', [req.params.id]);
    res.json({ message: 'Subject deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Past Papers ───────────────────────────────────────────
router.get('/past-papers', async (req, res) => {
  try {
    const result = await query('SELECT * FROM past_papers ORDER BY year DESC, created_at DESC');
    res.json(result.rows.map(p => ({
      id:         p.id,
      subject:    p.subject || '',
      grade:      p.grade || '',
      year:       p.year,
      paper:      p.paper || '',
      title:      p.title || '',
      url:        p.file_url || '',
      subject_id: p.subject_id || null,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/past-papers', async (req, res) => {
  const { subject_id, subject, grade, year, paper, title, file_url } = req.body;
  try {
    const result = await query(
      `INSERT INTO past_papers (subject_id, subject, grade, year, paper, title, file_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [subject_id || null, subject || '', grade || '', Number(year) || new Date().getFullYear(),
       paper || '', title || '', file_url || '']
    );
    const p = result.rows[0];
    res.status(201).json({ id: p.id, subject: p.subject, grade: p.grade, year: p.year,
      paper: p.paper, title: p.title, url: p.file_url, subject_id: p.subject_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/past-papers/:id', async (req, res) => {
  try {
    await query('DELETE FROM past_papers WHERE id = $1', [req.params.id]);
    res.json({ message: 'Past paper deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Subscriptions ─────────────────────────────────────────
router.get('/subscriptions', async (req, res) => {
  try {
    const result = await query(
      `SELECT id, name, email, role, subscription_plan, subscription_expiry, created_at
       FROM users ORDER BY created_at DESC`
    );
    res.json(result.rows.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      subscription_plan: u.subscription_plan || '',
      subscription_expiry: u.subscription_expiry,
      is_subscribed: u.subscription_expiry ? new Date(u.subscription_expiry) > new Date() : false,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/subscriptions/activate', async (req, res) => {
  const { email, plan, days } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required.' });
  const numDays = parseInt(days) || 60;
  const expiry = new Date(Date.now() + numDays * 24 * 60 * 60 * 1000);
  try {
    const result = await query(
      `UPDATE users SET subscription_plan=$1, subscription_expiry=$2
       WHERE email=$3 RETURNING id, name, email, subscription_expiry`,
      [plan || '2-month', expiry, email.toLowerCase()]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'No user found with this email.' });
    res.json({ message: `Subscription activated for ${email} until ${expiry.toDateString()}.`, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/subscriptions/:id', async (req, res) => {
  try {
    await query(
      `UPDATE users SET subscription_plan='', subscription_expiry=NULL WHERE id=$1`,
      [req.params.id]
    );
    res.json({ message: 'Subscription revoked.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
