const fs = require('fs');
const content = `const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const sign = (user) => jwt.sign(
  { id: user.id, name: user.name, email: user.email, role: user.role || "student" },
  process.env.JWT_SECRET || "ss_elearning_secret",
  { expiresIn: "7d" }
);

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Name, email, and password are required." });
  try {
    const hash = await bcrypt.hash(password, 10);
    const r = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email, hash]
    );
    const user = r.rows[0];
    res.status(201).json({ message: "Account created.", token: sign(user), user });
  } catch (err) {
    if (err.code === "23505")
      return res.status(409).json({ error: "An account with this email already exists." });
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });
  try {
    const r = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (r.rows.length === 0)
      return res.status(401).json({ error: "No account found with this email." });
    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Incorrect password. Please try again." });
    const safe = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.json({ message: "Login successful.", token: sign(safe), user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = (req, res) => res.json({ user: req.user });
`;
fs.writeFileSync('controllers/authController.js', content, 'utf8');
console.log('authController.js written OK');
