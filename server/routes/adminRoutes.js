const express = require("express");
const db = require("../config/db");
const router = express.Router();
// Note: admin check is done on frontend for now (no JWT role in local auth)
// When backend is running, uncomment: const admin = require("../middleware/adminMiddleware");

// ── Stats ─────────────────────────────────────────────────
router.get("/stats", (req, res) => {
  Promise.all([
    new Promise(r => db.query("SELECT COUNT(*) as count FROM users", [], (e, rows) => r(e ? 0 : parseInt(rows[0]?.count || 0)))),
    new Promise(r => db.query("SELECT COUNT(*) as count FROM subjects", [], (e, rows) => r(e ? 0 : parseInt(rows[0]?.count || 0)))),
    new Promise(r => db.query("SELECT COUNT(*) as count FROM chapters", [], (e, rows) => r(e ? 0 : parseInt(rows[0]?.count || 0)))),
    new Promise(r => db.query("SELECT COUNT(*) as count FROM past_papers", [], (e, rows) => r(e ? 0 : parseInt(rows[0]?.count || 0)))),
  ]).then(([users, subjects, chapters, papers]) => {
    res.json({ users, subjects, chapters, papers, db: "connected", dbName: process.env.DB_NAME });
  }).catch(err => res.status(500).json({ error: err.message }));
});

// ── Users ─────────────────────────────────────────────────
router.get("/users", (req, res) => {
  db.query("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.put("/users/:id/role", (req, res) => {
  const { role } = req.body;
  if (!["student","teacher","admin"].includes(role))
    return res.status(400).json({ error: "Invalid role." });
  db.query("UPDATE users SET role=? WHERE id=?", [role, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Role updated." });
  });
});

router.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted." });
  });
});

// ── Subjects ──────────────────────────────────────────────
router.get("/subjects", (req, res) => {
  db.query("SELECT s.*, g.name as grade_name, st.name as stream_name FROM subjects s LEFT JOIN grades g ON s.grade_id=g.id LEFT JOIN streams st ON s.stream_id=st.id ORDER BY g.id, s.name", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.post("/subjects", (req, res) => {
  const { name, grade_id, stream_id } = req.body;
  db.query("INSERT INTO subjects (name, grade_id, stream_id) VALUES (?,?,?)", [name, grade_id, stream_id || null], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Subject added." });
  });
});

router.delete("/subjects/:id", (req, res) => {
  db.query("DELETE FROM subjects WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Subject deleted." });
  });
});

// ── Past Papers ───────────────────────────────────────────
router.post("/past-papers", (req, res) => {
  const { subject_id, year, title, file_url } = req.body;
  db.query("INSERT INTO past_papers (subject_id, year, title, file_url) VALUES (?,?,?,?)", [subject_id, year, title, file_url], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Past paper added." });
  });
});

router.delete("/past-papers/:id", (req, res) => {
  db.query("DELETE FROM past_papers WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Past paper deleted." });
  });
});

module.exports = router;
