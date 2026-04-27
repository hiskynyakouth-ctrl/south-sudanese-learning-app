const express = require("express");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

const router = express.Router();

const METADATA_FILE = path.join(__dirname, "../uploads/metadata.json");

const readMeta = () => {
  try { return JSON.parse(fs.readFileSync(METADATA_FILE, "utf8")); }
  catch { return { textbooks: [], papers: [] }; }
};
const writeMeta = (data) => {
  fs.mkdirSync(path.dirname(METADATA_FILE), { recursive: true });
  fs.writeFileSync(METADATA_FILE, JSON.stringify(data, null, 2), "utf8");
};

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

// ── Upload textbook (with metadata) ──────────────────────
router.post("/textbook", uploadTextbook.single("pdf"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });
  const url = `/uploads/textbooks/${req.file.filename}`;
  const entry = {
    filename: req.file.filename,
    url,
    originalName: req.file.originalname,
    size: req.file.size,
    subject:     req.body.subject     || "",
    grade:       req.body.grade       || "",
    description: req.body.description || "",
    uploadedAt:  new Date().toISOString(),
  };
  const meta = readMeta();
  meta.textbooks = meta.textbooks.filter(t => t.filename !== entry.filename);
  meta.textbooks.push(entry);
  writeMeta(meta);
  res.json(entry);
});

// ── Upload past paper (with metadata) ────────────────────
router.post("/paper", uploadPaper.single("pdf"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });
  const url = `/uploads/papers/${req.file.filename}`;
  const entry = {
    filename: req.file.filename,
    url,
    originalName: req.file.originalname,
    size: req.file.size,
    subject: req.body.subject || "",
    grade:   req.body.grade   || "",
    year:    parseInt(req.body.year) || new Date().getFullYear(),
    paper:   req.body.paper   || "Paper 1",
    title:   req.body.title   || `${req.body.subject || ""} ${req.body.year || ""} — ${req.body.paper || "Paper 1"}`,
    uploadedAt: new Date().toISOString(),
  };
  const meta = readMeta();
  meta.papers = meta.papers.filter(p => p.filename !== entry.filename);
  meta.papers.push(entry);
  writeMeta(meta);
  res.json(entry);
});

// ── List textbooks (with metadata) ───────────────────────
router.get("/list/textbooks", (req, res) => {
  const dir = path.join(__dirname, "../uploads/textbooks");
  fs.mkdirSync(dir, { recursive: true });
  const meta = readMeta();
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".pdf"));
  const result = files.map(f => {
    const saved = meta.textbooks.find(m => m.filename === f);
    return saved || {
      filename: f,
      url: `/uploads/textbooks/${f}`,
      originalName: f,
      subject: guessSubject(f),
      grade: guessGrade(f),
      description: "",
      uploadedAt: "",
    };
  });
  res.json(result);
});

// ── List papers (with metadata) ───────────────────────────
router.get("/list/papers", (req, res) => {
  const dir = path.join(__dirname, "../uploads/papers");
  fs.mkdirSync(dir, { recursive: true });
  const meta = readMeta();
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".pdf"));
  const result = files.map(f => {
    const saved = meta.papers.find(m => m.filename === f);
    return saved || {
      filename: f,
      url: `/uploads/papers/${f}`,
      originalName: f,
      subject: guessSubject(f),
      grade: guessGrade(f),
      year: new Date().getFullYear(),
      paper: "Paper 1",
      title: f.replace(/_/g, " ").replace(".pdf", ""),
      uploadedAt: "",
    };
  });
  res.json(result);
});

// ── Save/update metadata for existing file ────────────────
router.post("/metadata", (req, res) => {
  const { filename, type, ...data } = req.body;
  if (!filename || !type) return res.status(400).json({ error: "filename and type required." });
  const meta = readMeta();
  const key = type === "textbooks" ? "textbooks" : "papers";
  const idx = meta[key].findIndex(m => m.filename === filename);
  if (idx !== -1) { meta[key][idx] = { ...meta[key][idx], ...data }; }
  else { meta[key].push({ filename, ...data }); }
  writeMeta(meta);
  res.json({ message: "Metadata saved." });
});

// ── Delete file ───────────────────────────────────────────
router.delete("/:type/:filename", (req, res) => {
  const folder = req.params.type === "textbooks" ? "textbooks" : "papers";
  const filePath = path.join(__dirname, "../uploads", folder, req.params.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  // Remove from metadata
  const meta = readMeta();
  const key = folder;
  meta[key] = meta[key].filter(m => m.filename !== req.params.filename);
  writeMeta(meta);
  res.json({ message: "File deleted." });
});

// ── Helper: guess subject/grade from filename ─────────────
function guessSubject(filename) {
  const f = filename.toLowerCase();
  if (f.includes("biology") || f.includes("bio")) return "Biology";
  if (f.includes("chemistry") || f.includes("chem")) return "Chemistry";
  if (f.includes("physics") || f.includes("phy")) return "Physics";
  if (f.includes("math") || f.includes("maths")) return "Mathematics";
  if (f.includes("english") || f.includes("eng")) return "English";
  if (f.includes("history") || f.includes("hist")) return "History";
  if (f.includes("geography") || f.includes("geo")) return "Geography";
  if (f.includes("economics") || f.includes("eco")) return "Economics";
  if (f.includes("cre") || f.includes("christian") || f.includes("religious")) return "Christian Religious Education";
  if (f.includes("citizenship") || f.includes("citizen")) return "Citizenship";
  if (f.includes("ict") || f.includes("computer")) return "Computer Studies";
  if (f.includes("agriculture") || f.includes("agri")) return "Agriculture";
  if (f.includes("accounting") || f.includes("acc")) return "Accounting";
  if (f.includes("literature") || f.includes("lit")) return "English Literature";
  if (f.includes("add") && f.includes("math")) return "Additional Mathematics";
  return "General";
}

function guessGrade(filename) {
  const f = filename.toLowerCase();
  if (f.includes("_s4") || f.includes("s_4") || f.includes("senior_4") || f.includes("secondary_4") || f.includes("4_student")) return "Senior 4";
  if (f.includes("_s3") || f.includes("s_3") || f.includes("senior_3") || f.includes("secondary_3") || f.includes("3_student")) return "Senior 3";
  if (f.includes("_s2") || f.includes("s_2") || f.includes("senior_2") || f.includes("secondary_2") || f.includes("2_student")) return "Senior 2";
  if (f.includes("_s1") || f.includes("s_1") || f.includes("senior_1") || f.includes("secondary_1") || f.includes("1_student")) return "Senior 1";
  return "Senior 1";
}

module.exports = router;
