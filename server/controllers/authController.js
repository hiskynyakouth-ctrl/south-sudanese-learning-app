const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, getDbStatus } = require('../config/db');

const signUser = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role || 'student' },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  );

const requireDb = (res) => {
  if (getDbStatus().state === 1) return true;
  res.status(503).json({ error: 'Database is not connected. Check DATABASE_URL on the backend server.' });
  return false;
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  if (!requireDb(res)) return;

  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length)
      return res.status(409).json({ error: 'An account with this email already exists.' });

    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'student') RETURNING id, name, email, role`,
      [name.trim(), email.toLowerCase(), hash]
    );
    const user = result.rows[0];
    return res.status(201).json({
      message: 'Account created successfully.',
      token: signUser(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
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
    const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });

    return res.json({
      message: 'Login successful.',
      token: signUser(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const { query } = require('../config/db');
    const result = await query(
      'SELECT id, name, email, role, subscription_plan, subscription_expiry FROM users WHERE id=$1',
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: {
      id: user.id, name: user.name, email: user.email, role: user.role,
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
    const existing = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length) {
      const user = existing.rows[0];
      if (user.google_id && user.google_id !== googleId)
        return res.status(409).json({ error: 'This email is registered with another Google account.' });
      if (!user.google_id)
        return res.status(409).json({ error: 'An account with this email already exists. Please login instead.' });
      return res.json({
        message: 'Login successful.',
        token: signUser(user),
        user: { id: user.id, name: user.name, email: user.email, role: user.role, picture: user.picture },
      });
    }

    const hash = await bcrypt.hash(password || `google_${googleId}`, 10);
    const result = await query(
      `INSERT INTO users (name, email, password, google_id, picture, role)
       VALUES ($1, $2, $3, $4, $5, 'student') RETURNING id, name, email, role, picture`,
      [name.trim(), email.toLowerCase(), hash, googleId, picture || '']
    );
    const user = result.rows[0];
    return res.status(201).json({
      message: 'Account created successfully.',
      token: signUser(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, picture: user.picture },
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
    const result = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (!result.rows.length)
      return res.status(404).json({ error: 'No account found with this email.' });

    const hash = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = $1 WHERE email = $2', [hash, email.toLowerCase()]);
    return res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
