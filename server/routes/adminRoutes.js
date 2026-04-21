const express = require("express");
const { pool } = require("../config/db");
const router = express.Router();

// Helper — run a query and return rows
const q = (sql, params = []) => pool.query(sql, params).then(r => r.rows);

// ── Stats ─────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const [u, s, c, p] = await Promise.all([
      q("SELECT COUNT(*) AS count FROM users"),
      q("SELECT COUNT(*) AS count FROM subjects"),
      q("SELECT COUNT(*) AS count FROM chapters"),
      q("SELECT COUNT(*) AS count FROM past_papers"),
    ]);
    res.json({
      users:    parseInt(u[0].count) || 0,
      subjects: parseInt(s[0].count) || 0,
      chapters: parseInt(c[0].count) || 0,
      papers:   parseInt(p[0].count) || 0,
      db: "connected",
      dbName: process.env.DB_NAME,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Users ─────────────────────────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const rows = await q("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  if (!["student","teacher","admin"].includes(role))
    return res.status(400).json({ error: "Invalid role." });
  try {
    await q("UPDATE users SET role=$1 WHERE id=$2", [role, req.params.id]);
    res.json({ message: "Role updated." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await q("DELETE FROM users WHERE id=$1", [req.params.id]);
    res.json({ message: "User deleted." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Subjects ──────────────────────────────────────────────
router.get("/subjects", async (req, res) => {
  try {
    const rows = await q(`
      SELECT s.*, g.name AS grade_name, st.name AS stream_name
      FROM subjects s
      LEFT JOIN grades g ON s.grade_id = g.id
      LEFT JOIN streams st ON s.stream_id = st.id
      ORDER BY g.id, s.name
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/subjects", async (req, res) => {
  const { name, grade_id, stream_id } = req.body;
  try {
    await q("INSERT INTO subjects (name, grade_id, stream_id) VALUES ($1, $2, $3)", [name, grade_id, stream_id || null]);
    res.status(201).json({ message: "Subject added." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/subjects/:id", async (req, res) => {
  const { name, grade_id, stream_id } = req.body;
  try {
    await q("UPDATE subjects SET name=$1, grade_id=$2, stream_id=$3 WHERE id=$4", [name, grade_id, stream_id || null, req.params.id]);
    res.json({ message: "Subject updated." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/subjects/:id", async (req, res) => {
  try {
    await q("DELETE FROM subjects WHERE id=$1", [req.params.id]);
    res.json({ message: "Subject deleted." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Past Papers ───────────────────────────────────────────
router.get("/past-papers", async (req, res) => {
  try {
    const rows = await q("SELECT * FROM past_papers ORDER BY year DESC");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/past-papers", async (req, res) => {
  const { subject_id, year, title, file_url } = req.body;
  try {
    await q("INSERT INTO past_papers (subject_id, year, title, file_url) VALUES ($1, $2, $3, $4)", [subject_id || null, year, title, file_url]);
    res.status(201).json({ message: "Past paper added." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/past-papers/:id", async (req, res) => {
  try {
    await q("DELETE FROM past_papers WHERE id=$1", [req.params.id]);
    res.json({ message: "Past paper deleted." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
