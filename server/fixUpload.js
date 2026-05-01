const fs = require('fs');
const path = require('path');

const content = `const express = require("express");
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

const router = express.Router();

const META = path.join(__dirname, "../uploads/metadata.json");
const readMeta = () => { try { return JSON.parse(fs.readFileSync(META,"utf8")); } catch { return {textbooks:[],papers:[]}; } };
const saveMeta = (d) => { fs.mkdirSync(path.dirname(META),{recursive:true}); fs.writeFileSync(META,JSON.stringify(d,null,2),"utf8"); };

const makeStorage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => { const dir = path.join(__dirname,"../uploads",folder); fs.mkdirSync(dir,{recursive:true}); cb(null,dir); },
  filename: (req, file, cb) => { const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g,"_"); cb(null, Date.now()+"_"+safe); },
});
const pdfFilter = (req, file, cb) => { file.mimetype==="application/pdf" ? cb(null,true) : cb(new Error("Only PDF files allowed."),false); };
const upTB = multer({storage:makeStorage("textbooks"),fileFilter:pdfFilter,limits:{fileSize:50*1024*1024}});
const upPP = multer({storage:makeStorage("papers"),fileFilter:pdfFilter,limits:{fileSize:20*1024*1024}});

function guessSubject(f) {
  f = f.toLowerCase();
  if (f.includes("biology")||f.includes("bio_")) return "Biology";
  if (f.includes("chemistry")||f.includes("chem")) return "Chemistry";
  if (f.includes("physics")||f.includes("phy_")) return "Physics";
  if (f.includes("add")&&f.includes("math")) return "Additional Mathematics";
  if (f.includes("math")||f.includes("maths")) return "Mathematics";
  if (f.includes("english")&&f.includes("lit")) return "English Literature";
  if (f.includes("english")||f.includes("eng_")) return "English";
  if (f.includes("history")||f.includes("hist")) return "History";
  if (f.includes("geography")||f.includes("geo_")) return "Geography";
  if (f.includes("economics")||f.includes("eco_")) return "Economics";
  if (f.includes("christian")||f.includes("cre_")||f.includes("_cre")) return "Christian Religious Education";
  if (f.includes("citizenship")||f.includes("citizen")) return "Citizenship";
  if (f.includes("ict")||f.includes("computer")) return "Computer Studies";
  if (f.includes("agriculture")||f.includes("agri")) return "Agriculture";
  if (f.includes("accounting")||f.includes("acc_")) return "Accounting";
  if (f.includes("commerce")) return "Commerce";
  return "General";
}

function guessGrade(f) {
  f = f.toLowerCase();
  if (f.includes("_s4")||f.includes("s_4")||f.includes("_4_")||f.includes("secondary_4")||f.includes("4_student")) return "Senior 4";
  if (f.includes("_s3")||f.includes("s_3")||f.includes("_3_")||f.includes("secondary_3")||f.includes("3_student")) return "Senior 3";
  if (f.includes("_s2")||f.includes("s_2")||f.includes("_2_")||f.includes("secondary_2")||f.includes("2_student")) return "Senior 2";
  if (f.includes("_s1")||f.includes("s_1")||f.includes("_1_")||f.includes("secondary_1")||f.includes("1_student")) return "Senior 1";
  return "Senior 1";
}

router.post("/textbook", upTB.single("pdf"), (req, res) => {
  if (!req.file) return res.status(400).json({error:"No PDF uploaded."});
  const entry = {
    filename: req.file.filename, url: "/uploads/textbooks/"+req.file.filename,
    originalName: req.file.originalname, size: req.file.size,
    subject: req.body.subject || guessSubject(req.file.originalname),
    grade:   req.body.grade   || guessGrade(req.file.originalname),
    description: req.body.description || "",
    uploadedAt: new Date().toISOString(),
  };
  const meta = readMeta();
  meta.textbooks = meta.textbooks.filter(t => t.filename !== entry.filename);
  meta.textbooks.push(entry);
  saveMeta(meta);
  res.json(entry);
});

router.post("/paper", upPP.single("pdf"), (req, res) => {
  if (!req.file) return res.status(400).json({error:"No PDF uploaded."});
  const entry = {
    filename: req.file.filename, url: "/uploads/papers/"+req.file.filename,
    originalName: req.file.originalname, size: req.file.size,
    subject: req.body.subject || guessSubject(req.file.originalname),
    grade:   req.body.grade   || guessGrade(req.file.originalname),
    year:    parseInt(req.body.year)||new Date().getFullYear(),
    paper:   req.body.paper||"Paper 1",
    title:   req.body.title||(req.body.subject+" "+req.body.year+" — "+req.body.paper),
    uploadedAt: new Date().toISOString(),
  };
  const meta = readMeta();
  meta.papers = meta.papers.filter(p => p.filename !== entry.filename);
  meta.papers.push(entry);
  saveMeta(meta);
  res.json(entry);
});

router.get("/list/textbooks", (req, res) => {
  const dir = path.join(__dirname,"../uploads/textbooks");
  fs.mkdirSync(dir,{recursive:true});
  const meta = readMeta();
  const files = fs.readdirSync(dir).filter(f=>f.endsWith(".pdf"));
  const result = files.map(f => {
    const saved = meta.textbooks.find(m=>m.filename===f);
    if (saved && saved.subject) return saved;
    return { filename:f, url:"/uploads/textbooks/"+f, originalName:f,
      subject: guessSubject(f), grade: guessGrade(f), description:"", uploadedAt:"" };
  });
  res.json(result);
});

router.get("/list/papers", (req, res) => {
  const dir = path.join(__dirname,"../uploads/papers");
  fs.mkdirSync(dir,{recursive:true});
  const meta = readMeta();
  const files = fs.readdirSync(dir).filter(f=>f.endsWith(".pdf"));
  const result = files.map(f => {
    const saved = meta.papers.find(m=>m.filename===f);
    if (saved && saved.subject) return saved;
    return { filename:f, url:"/uploads/papers/"+f, originalName:f,
      subject: guessSubject(f), grade: guessGrade(f),
      year: new Date().getFullYear(), paper:"Paper 1",
      title: f.replace(/_/g," ").replace(".pdf",""), uploadedAt:"" };
  });
  res.json(result);
});

router.post("/metadata", (req, res) => {
  const { filename, type, ...data } = req.body;
  if (!filename||!type) return res.status(400).json({error:"filename and type required."});
  const meta = readMeta();
  const key = type==="textbooks"?"textbooks":"papers";
  const idx = meta[key].findIndex(m=>m.filename===filename);
  if (idx!==-1) meta[key][idx]={...meta[key][idx],...data};
  else meta[key].push({filename,...data});
  saveMeta(meta);
  res.json({message:"Metadata saved."});
});

router.delete("/:type/:filename", (req, res) => {
  const folder = req.params.type==="textbooks"?"textbooks":"papers";
  const fp = path.join(__dirname,"../uploads",folder,req.params.filename);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  const meta = readMeta();
  meta[folder] = meta[folder].filter(m=>m.filename!==req.params.filename);
  saveMeta(meta);
  res.json({message:"Deleted."});
});

module.exports = router;
`;

fs.writeFileSync('routes/uploadRoutes.js', content, 'utf8');
console.log('uploadRoutes.js written, lines:', content.split('\n').length);
