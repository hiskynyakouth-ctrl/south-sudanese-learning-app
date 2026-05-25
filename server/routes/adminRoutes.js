const express = require('express');
const mongoose = require('mongoose');
const { getDbStatus } = require('../config/db');
const adminMiddleware = require('../middleware/adminMiddleware');
const User = require('../models/userModel');
const Subject = require('../models/subjectModel');
const Chapter = require('../models/chapterModel');
const PastPaper = require('../models/pastPaperModel');

const router = express.Router();
router.use(adminMiddleware);
router.use((req, res, next) => {
  if (getDbStatus().state === 1) return next();
  return res.status(503).json({ error: 'Database is not connected. Check MONGO_URI on the backend server.' });
});

const GRADE_MAP = { 1: 'Senior 1', 2: 'Senior 2', 3: 'Senior 3', 4: 'Senior 4' };
const STREAM_MAP = { 1: 'Natural Sciences', 2: 'Social Sciences' };

const subjectPayload = (subject) => {
  const gradeId = Number(subject.gradeId ?? subject.classId ?? 0);
  const streamId = subject.streamId != null ? Number(subject.streamId) : null;
  return {
    id: subject._id.toString(),
    name: subject.name,
    description: subject.description || '',
    grade_id: gradeId,
    stream_id: streamId,
    grade_name: GRADE_MAP[gradeId] || (gradeId ? `Grade ${gradeId}` : 'Unknown'),
    stream_name: streamId ? STREAM_MAP[streamId] || 'Core' : 'Core',
    icon: subject.icon || '📘',
    created_at: subject.createdAt,
    updated_at: subject.updatedAt,
  };
};

// ── Stats ─────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [users, subjects, chapters, papers] = await Promise.all([
      User.countDocuments(),
      Subject.countDocuments(),
      Chapter.countDocuments(),
      PastPaper.countDocuments(),
    ]);

    res.json({
      users,
      subjects,
      chapters,
      papers,
      db: 'connected',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Users ─────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'student',
      created_at: user.createdAt,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['student', 'teacher', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }

  try {
    await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
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

// ── Subjects ──────────────────────────────────────────────
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ gradeId: 1, classId: 1, name: 1 });
    res.json(subjects.map(subjectPayload));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/subjects', async (req, res) => {
  const { name, grade_id, stream_id, description } = req.body;
  const gradeId = Number(grade_id) || 0;
  const streamId = stream_id != null ? Number(stream_id) : null;

  try {
    const subject = await Subject.create({
      name,
      description: description || '',
      gradeId,
      streamId,
      classId: gradeId || 0,
    });
    res.status(201).json(subjectPayload(subject));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/subjects/:id', async (req, res) => {
  const { name, grade_id, stream_id, description } = req.body;
  const gradeId = Number(grade_id) || 0;
  const streamId = stream_id != null ? Number(stream_id) : null;

  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description: description || '',
        gradeId,
        streamId,
        classId: gradeId || 0,
      },
      { new: true }
    );
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
    res.json(papers.map((paper) => ({
      id: paper._id.toString(),
      subject: paper.subject || '',
      grade: paper.grade || '',
      year: paper.year,
      paper: paper.paper || '',
      title: paper.title || '',
      url: paper.file_url || '',
      subject_id: paper.subjectId ? paper.subjectId.toString() : null,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/past-papers', async (req, res) => {
  const { subject_id, subject, grade, year, paper, title, file_url } = req.body;
  const subjectId = subject_id && mongoose.isValidObjectId(subject_id) ? subject_id : null;

  try {
    const newPaper = await PastPaper.create({
      subjectId,
      subject: subject || '',
      grade: grade || '',
      year: Number(year) || new Date().getFullYear(),
      paper: paper || '',
      title: title || '',
      file_url: file_url || '',
    });
    res.status(201).json({
      id: newPaper._id.toString(),
      subject: newPaper.subject,
      grade: newPaper.grade,
      year: newPaper.year,
      paper: newPaper.paper,
      title: newPaper.title,
      url: newPaper.file_url,
      subject_id: newPaper.subjectId ? newPaper.subjectId.toString() : null,
    });
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

module.exports = router;
