const express = require('express');
const { getDbStatus } = require('../config/db');
const adminMiddleware = require('../middleware/adminMiddleware');
const User = require('../models/userModel');
const Subject = require('../models/subjectModel');
const Chapter = require('../models/chapterModel');
const PastPaper = require('../models/pastPaperModel');
const Payment = require('../models/paymentModel');

const router = express.Router();
router.use(adminMiddleware);

// DB check middleware
router.use((req, res, next) => {
  if (getDbStatus().state === 1) return next();
  return res.status(503).json({ error: 'Database is not connected. Check MONGO_URI on the backend server.' });
});

const GRADE_MAP  = { 1: 'Senior 1', 2: 'Senior 2', 3: 'Senior 3', 4: 'Senior 4' };
const STREAM_MAP = { 1: 'Natural Sciences', 2: 'Social Sciences' };

const subjectPayload = (s) => ({
  id:          s._id,
  name:        s.name,
  description: s.description || '',
  grade_id:    s.gradeId,
  stream_id:   s.streamId,
  grade_name:  GRADE_MAP[s.gradeId] || (s.gradeId ? `Grade ${s.gradeId}` : 'Unknown'),
  stream_name: s.streamId ? STREAM_MAP[s.streamId] || 'Core' : 'Core',
  icon:        s.icon || '📘',
  created_at:  s.createdAt,
  updated_at:  s.updatedAt,
});

// ── Stats ────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [users, subjects, chapters, papers] = await Promise.all([
      User.countDocuments(),
      Subject.countDocuments(),
      Chapter.countDocuments(),
      PastPaper.countDocuments(),
    ]);
    res.json({
      users:    users,
      subjects: subjects,
      chapters: chapters,
      papers:   papers,
      db: 'connected',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Users ────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('id name email role createdAt').sort('-createdAt');
    res.json(users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role, created_at: u.createdAt })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['student', 'teacher', 'admin'].includes(role))
    return res.status(400).json({ error: 'Invalid role.' });
  try {
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: 'Role updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Subjects ─────────────────────────────────────────────
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ gradeId: 1, name: 1 });
    res.json(subjects.map(subjectPayload));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/subjects', async (req, res) => {
  const { name, grade_id, stream_id, description } = req.body;
  try {
    const subject = await Subject.create({
      name,
      description: description || '',
      gradeId: Number(grade_id) || 0,
      streamId: stream_id != null ? Number(stream_id) : null
    });
    res.status(201).json(subjectPayload(subject));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/subjects/:id', async (req, res) => {
  const { name, grade_id, stream_id, description } = req.body;
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, {
      name,
      description: description || '',
      gradeId: Number(grade_id) || 0,
      streamId: stream_id != null ? Number(stream_id) : null
    }, { new: true });
    
    if (!subject) return res.status(404).json({ error: 'Subject not found.' });
    res.json(subjectPayload(subject));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/subjects/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Past Papers ───────────────────────────────────────────
router.get('/past-papers', async (req, res) => {
  try {
    const papers = await PastPaper.find().sort({ year: -1, createdAt: -1 });
    res.json(papers.map(p => ({
      id:         p._id,
      subject:    p.subject || '',
      grade:      p.grade || '',
      year:       p.year,
      paper:      p.paper || '',
      title:      p.title || '',
      url:        p.file_url || '',
      subject_id: p.subjectId || null,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/past-papers', async (req, res) => {
  const { subject_id, subject, grade, year, paper, title, file_url } = req.body;
  try {
    const p = await PastPaper.create({
      subjectId: subject_id || null,
      subject: subject || '',
      grade: grade || '',
      year: Number(year) || new Date().getFullYear(),
      paper: paper || '',
      title: title || '',
      file_url: file_url || ''
    });
    res.status(201).json({ id: p._id, subject: p.subject, grade: p.grade, year: p.year,
      paper: p.paper, title: p.title, url: p.file_url, subject_id: p.subjectId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/past-papers/:id', async (req, res) => {
  try {
    await PastPaper.findByIdAndDelete(req.params.id);
    res.json({ message: 'Past paper deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Subscriptions ─────────────────────────────────────────
router.get('/subscriptions', async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json(users.map(u => ({
      id: u._id,
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

// ── Payments ───────────────────────────────────────────
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name')
      .sort('-createdAt')
      .limit(200);

    res.json(payments.map(p => ({
      id: p._id,
      user_id: p.userId ? p.userId._id : null,
      user_name: p.userId ? p.userId.name : 'Unknown',
      email: p.email,
      tx_ref: p.tx_ref,
      amount: parseFloat(p.amount || 0),
      currency: p.currency,
      provider: p.provider,
      status: p.status,
      created_at: p.createdAt,
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
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { subscription_plan: plan || '2-month', subscription_expiry: expiry },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'No user found with this email.' });
    res.json({ message: `Subscription activated for ${email} until ${expiry.toDateString()}.`, user: {
      id: user._id, name: user.name, email: user.email, subscription_expiry: user.subscription_expiry
    }});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/subscriptions/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      subscription_plan: '',
      subscription_expiry: null
    });
    res.json({ message: 'Subscription revoked.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
