const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const signUser = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET || "ss_elearning_secret",
    { expiresIn: "7d" }
  );

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Name, email, and password are required." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?) RETURNING id",
      [name, email, hashedPassword],
      (err, rows) => {
        if (err) {
          if (err.code === "23505" || err.message?.includes("unique"))
            return res.status(409).json({ error: "An account with this email already exists." });
          return res.status(500).json({ error: err.message });
        }
        const user = { id: rows[0]?.id || Date.now(), name, email };
        return res.status(201).json({ message: "Account created.", token: signUser(user), user });
      }
    );
  } catch (err) {
    return res.status(500).json({ error: "Unable to create account." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows || rows.length === 0)
      return res.status(401).json({ error: "No account found with this email." });

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ error: "Incorrect password. Please try again." });

    const safeUser = { id: user.id, name: user.name, email: user.email };
    return res.json({ message: "Login successful.", token: signUser(safeUser), user: safeUser });
  });
};

exports.me = (req, res) => {
  return res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email } });
};
