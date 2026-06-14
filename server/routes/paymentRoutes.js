const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { query } = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for memory storage so we can attach it directly to email
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Configure Nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'thiyangkoang77@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

router.post('/submit', authMiddleware, upload.single('receipt'), async (req, res) => {
  try {
    const { plan, amount, currency, method, email, name } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Payment receipt screenshot is required.' });
    }

    // 1. Insert payment record into database
    await query(
      `INSERT INTO payments (user_id, email, tx_ref, amount, currency, provider, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
      [req.user.id, email || req.user.email, `REQ-${Date.now()}`, amount || 0, currency || 'USD', method || 'Manual']
    );

    // 2. Send Email to Admin with the screenshot attached
    const adminEmail = process.env.GMAIL_USER || 'thiyangkoang77@gmail.com';
    const transporter = createTransporter();

    if (process.env.GMAIL_APP_PASSWORD) {
      await transporter.sendMail({
        from: `"${name || req.user.name}" <${email || req.user.email}>`,
        to: adminEmail,
        subject: `New Payment Received: ${plan} (${currency} ${amount})`,
        text: `
Hello Admin,

A new payment request has been submitted.

User: ${name || req.user.name} (${email || req.user.email})
Plan: ${plan}
Amount: ${amount} ${currency}
Payment Method: ${method}
Status: Pending Verification

The payment receipt screenshot is attached to this email. Please verify the payment and activate their subscription from the Admin Dashboard.
`,
        attachments: [
          {
            filename: file.originalname || 'receipt.png',
            content: file.buffer
          }
        ]
      });
    } else {
      console.warn("Payment submitted but email not sent because GMAIL_APP_PASSWORD is not set.");
    }

    res.json({ message: 'Payment submitted successfully. The admin has been notified.' });
  } catch (error) {
    console.error("Payment Submission Error:", error);
    res.status(500).json({ error: 'Failed to submit payment. Please try again later.' });
  }
});

module.exports = router;
