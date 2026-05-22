const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { pool } = require('../config/db');

const signUser = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role || 'student' },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  );

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: 'student' });

    const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role || 'student' };
    return res.status(201).json({
      message: 'Account created successfully.',
      token: signUser(user),
      user: safeUser,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role || 'student' };
    return res.json({
      message: 'Login successful.',
      token: signUser(user),
      user: safeUser,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.me = (req, res) => {
  return res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

exports.googleAuth = async (req, res) => {
  const { name, email, password, googleId, picture } = req.body;
  if (!name || !email || !googleId) {
    return res.status(400).json({ error: 'Name, email, and googleId are required.' });
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      if (user.googleId && user.googleId !== googleId) {
        return res.status(409).json({ error: 'This email is already registered with another Google account.' });
      }

      if (!user.googleId) {
        // Existing local account; do not automatically overwrite it.
        return res.status(409).json({ error: 'An account with this email already exists. Please login instead.' });
      }

      // Existing Google account - sign in
      return res.json({
        message: 'Login successful.',
        token: signUser(user),
        user: { id: user._id, name: user.name, email: user.email, role: user.role || 'student', picture: user.picture },
      });
    }

    const hashedPassword = await bcrypt.hash(password || `google_${googleId}`, 10);
    user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      googleId,
      picture,
      role: 'student',
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      token: signUser(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role || 'student', picture: user.picture },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).json({ error: 'Email and new password are required.' });

  try {
    const hash = await bcrypt.hash(newPassword, 10);
    const r = await pool.query(
      'UPDATE users SET password = $1 WHERE LOWER(email) = LOWER($2) RETURNING id',
      [hash, email]
    );

    if (r.rows.length === 0)
      return res.status(404).json({ error: 'No account found with this email.' });

    return res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
