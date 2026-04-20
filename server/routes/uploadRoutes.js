const express = require("express");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

const router = express.Router();

// ── Storage config ────────────────────────────────────────
const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, "../uploads", folder);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, `${Date.now()}_${safe}`);
    },
  });

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed."), false);
};

const uploadTextbook = multer({ storage: makeStorage("textbooks"), fileFilter: pdfFilter, limits: { fileSize: 50 * 1024 * 1024 } });
const uploadPaper    = multer({ storage: makeStorage("papers"),    fileFilter: pdfFilter, limits: { fileSize: 20 * 1024 * 1024 } });

// ── Upload textbook ───────────────────────────────────────
router.post("/textbook", uploadTextbook.single("pdf"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });
  const url = `/uploads/textbooks/${req.file.filename}`;
  res.json({ url, filename: req.file.filename, originalName: req.file.originalname, size: req.file.size });
});

// ── Upload past paper ─────────────────────────────────────
router.post("/paper", uploadPaper.single("pdf"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });
  const url = `/uploads/papers/${req.file.filename}`;
  res.json({ url, filename: req.file.filename, originalName: req.file.originalname, size: req.file.size });
});

// ── List uploaded files ───────────────────────────────────
router.get("/list/:type", (req, res) => {
  const folder = req.params.type === "textbooks" ? "textbooks" : "papers";
  const dir = path.join(__dirname, "../uploads", folder);
  fs.mkdirSync(dir, { recursive: true });
  const files = fs.readdirSync(dir).map(f => ({
    filename: f,
    url: `/uploads/${folder}/${f}`,
    size: fs.statSync(path.join(dir, f)).size,
  }));
  res.json(files);
});

// ── Delete uploaded file ──────────────────────────────────
router.delete("/:type/:filename", (req, res) => {
  const folder = req.params.type === "textbooks" ? "textbooks" : "papers";
  const filePath = path.join(__dirname, "../uploads", folder, req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: "File deleted." });
  } else {
    res.status(404).json({ error: "File not found." });
  }
});

module.exports = router;
