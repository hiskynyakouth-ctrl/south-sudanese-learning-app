const express = require('express');
const { query, getDbStatus } = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Save receipt images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/receipts');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, Date.now() + '_' + safe);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/payments/submit — student submits payment request
router.post('/submit', authMiddleware, upload.single('receipt'), async (req, res) => {
  if (!getDbStatus().state) {
    return res.status(503).json({ error: 'Database not connected.' });
  }

  const { plan, amount, currency, method, notes } = req.body;
  const email  = req.user?.email  || req.body.email  || '';
  const name   = req.user?.name   || req.body.name   || '';
  const userId = req.user?.id     || null;

  if (!email) return res.status(400).json({ error: 'Email required.' });

  try {
    const result = await query(
      `INSERT INTO payment_requests
         (user_id, email, name, plan, amount, currency, method, status, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8)
       RETURNING id`,
      [userId, email.toLowerCase(), name, plan||'', amount||'', currency||'', method||'', notes||'']
    );

    const paymentId = result.rows[0].id;
    const receiptUrl = req.file ? `/uploads/receipts/${req.file.filename}` : null;

    if (receiptUrl) {
      await query('UPDATE payment_requests SET notes=$1 WHERE id=$2',
        [`Receipt: ${receiptUrl}${notes ? '\n' + notes : ''}`, paymentId]);
    }

    res.json({
      message: 'Payment request submitted. Admin will verify and activate your subscription.',
      id: paymentId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
