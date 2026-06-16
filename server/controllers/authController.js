const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { getDbStatus } = require('../config/db');

const signUser = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role || 'student' },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  );

const requireDb = (res) => {
  if (getDbStatus().state === 1) return true;
  res.status(503).json({ error: 'Database is not connected. Check DATABASE_URL/MONGO_URI on the backend server.' });
  return false;
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  if (!requireDb(res)) return;

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ error: 'An account with this email already exists.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hash,
      role: 'student'
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      token: signUser(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });
  if (!requireDb(res)) return;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });

    return res.json({
      message: 'Login successful.',
      token: signUser(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: {
      id: user._id, name: user.name, email: user.email, role: user.role,
      subscription_plan: user.subscription_plan,
      subscription_expiry: user.subscription_expiry,
    }});
  } catch {
    // fallback — just return JWT data
    return res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } });
  }
};

exports.googleAuth = async (req, res) => {
  const { name, email, password, googleId, picture } = req.body;
  if (!name || !email || !googleId)
    return res.status(400).json({ error: 'Name, email, and googleId are required.' });
  if (!requireDb(res)) return;

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.googleId && existing.googleId !== googleId)
        return res.status(409).json({ error: 'This email is registered with another Google account.' });
      if (!existing.googleId)
        return res.status(409).json({ error: 'An account with this email already exists. Please login instead.' });
      return res.json({
        message: 'Login successful.',
        token: signUser(existing),
        user: { id: existing._id, name: existing.name, email: existing.email, role: existing.role, picture: existing.picture },
      });
    }

    const hash = await bcrypt.hash(password || `google_${googleId}`, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hash,
      googleId,
      picture: picture || '',
      role: 'student'
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      token: signUser(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role, picture: user.picture },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).json({ error: 'Email and new password are required.' });
  if (!requireDb(res)) return;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ error: 'No account found with this email.' });

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    
    return res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
