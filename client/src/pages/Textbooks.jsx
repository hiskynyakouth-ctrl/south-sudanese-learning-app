import { useEffect, useRef, useState } from "react";
import YouTubeIcon from "../components/YouTubeIcon";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { subjectIcons } from "../data/curriculum";

const GRADES = ["Senior 1","Senior 2","Senior 3","Senior 4"];
const GRADE_MAP = { "Senior 1":1,"Senior 2":2,"Senior 3":3,"Senior 4":4 };

const LS_KEY = "ss_textbooks";
const getLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)||"[]"); } catch { return []; } };
const setLocal = (d) => localStorage.setItem(LS_KEY, JSON.stringify(d));

const ytUrl = (subject) =>
  `https://www.youtube.com/results?search_query=South+Sudan+${encodeURIComponent(subject)}+lesson+tutorial`;

export default function Textbooks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

  // From URL: ?subject=Biology&grade=1
  const urlSubject = searchParams.get("subject") || "";
  const urlGrade   = searchParams.get("grade")   || "";
  const gradeLabel = urlGrade ? `Senior ${urlGrade}` : "";

  const [books, setBooks] = useState([]);
  const [activeGrade, setActiveGrade] = useState(gradeLabel || "All");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: urlSubject || "", grade: gradeLabel || "Senior 1", description: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef();

  useEffect(() => { loadBooks(); }, []);

  const loadBooks = async () => {
    try {
      const res = await api.get("/upload/list/textbooks");
      const local = getLocal();
      const merged = res.data.map(f => {
        const meta = local.find(l => l.filename === f.filename) || {};
        return { ...f, ...meta };
      });
      setBooks(merged);
    } catch {
      setBooks(getLocal());
    }
  };

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) { flash("Please select a PDF file."); return; }
    if (!form.subject.trim()) { flash("Please enter the subject name."); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("pdf", selectedFile);
      const res = await api.post("/upload/textbook", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const entry = {
        filename: res.data.filename, url: res.data.url,
        subject: form.subject, grade: form.grade,
        grade_id: GRADE_MAP[form.grade], description: form.description,
        originalName: res.data.originalName, size: res.data.size,
        uploadedAt: new Date().toISOString(),
      };
      const updated = [...getLocal(), entry];
      setLocal(updated); setBooks(updated);
      setForm({ subject:"", grade:"Senior 1", description:"" });
      setSelectedFile(null); setShowForm(false);
      flash(`"${form.subject}" uploaded!`);
    } catch (err) {
      flash(err.response?.data?.error || "Upload failed. Make sure the server is running.");
    } finally { setUploading(false); }
  };

  const deleteBook = async (book) => {
    if (!window.confirm(`Delete "${book.subject}"?`)) return;
    try { await api.delete(`/upload/textbooks/${book.filename}`); } catch {}
    const updated = getLocal().filter(b => b.filename !== book.filename);
    setLocal(updated); setBooks(updated);
    flash("Deleted.");
  };

  // Filter: if came from a subject card, show only that subject
  const filtered = books.filter(b => {
    const gradeMatch = activeGrade === "All" || b.grade === activeGrade;
    const subjectMatch = !urlSubject || (b.subject || "").toLowerCase() === urlSubject.toLowerCase();
    return gradeMatch && subjectMatch;
  });

  const API_BASE = process.env.REACT_APP_API_URL?.replace("/api","") || "http://localhost:5001";
  const icon = urlSubject === "Citizenship"
    ? <img src="https://flagcdn.com/w40/ss.png" alt="South Sudan" style={{ width:40, height:27, borderRadius:4, objectFit:"cover" }} />
    : (subjectIcons[urlSubject] ?? "📚");

  return (
    <div className="tb-upload-shell">

      {/* Header */}
      <div className="tb-upload-header">
        {urlSubject && (
          <button className="streams-back" onClick={() => navigate(-1)}>← Back</button>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginTop: urlSubject ? 8 : 0 }}>
          {urlSubject && <span style={{ fontSize:"2.5rem" }}>{icon}</span>}
          <div>
            <span className="eyebrow">
              {urlSubject ? `${gradeLabel} · Textbook` : "Official Ministry of Education"}
            </span>
            <h1>{urlSubject ? urlSubject : "📚 Textbooks & PDFs"}</h1>
          </div>
        </div>
        <p>
          {urlSubject
            ? `Read or download the official ${urlSubject} textbook for ${gradeLabel}.`
            : "Browse and read official South Sudan secondary school textbooks."}
        </p>
        {msg && <div className="admin-msg">{msg}</div>}
      </div>

      {/* Admin upload */}
      {isAdmin && (
        <button className="tb-upload-trigger" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "⬆️ Upload Textbook"}
        </button>
      )}

      {isAdmin && showForm && (
        <div className="tb-upload-form-card">
          <h2>⬆️ Upload Textbook PDF</h2>
          <form onSubmit={handleUpload} className="tb-upload-form">
            <div className="admin-field">
              <label>Subject Name</label>
              <input className="admin-input" placeholder="e.g. Biology, Mathematics"
                value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} required />
            </div>
            <div className="admin-field">
              <label>Grade</label>
              <select className="admin-select admin-select-lg" value={form.grade}
                onChange={e => setForm(f => ({...f, grade: e.target.value}))}>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="admin-field" style={{ gridColumn:"1/-1" }}>
              <label>Description (optional)</label>
              <input className="admin-input" placeholder="e.g. Covers the full Senior 1 Biology syllabus"
                value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
            </div>
            <div className="admin-field" style={{ gridColumn:"1/-1" }}>
              <label>PDF File (max 50MB)</label>
              <div className="tb-file-drop" onClick={() => fileRef.current?.click()}>
                {selectedFile
                  ? <><span>📄</span><strong>{selectedFile.name}</strong><small>{(selectedFile.size/1024/1024).toFixed(1)} MB</small></>
                  : <><span>📁</span><strong>Click to select PDF</strong><small>or drag and drop here</small></>}
              </div>
              <input ref={fileRef} type="file" accept=".pdf,application/pdf" style={{ display:"none" }}
                onChange={e => setSelectedFile(e.target.files[0])} />
            </div>
            <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
              <button type="submit" className="primary-button" disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Textbook"}
              </button>
              <button type="button" className="ghost-button" onClick={() => { setShowForm(false); setSelectedFile(null); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grade filter — only show when not filtered by subject */}
      {!urlSubject && (
        <div className="filter-row">
          {["All", ...GRADES].map(g => (
            <button key={g} className={`filter-pill${activeGrade===g?" active":""}`}
              onClick={() => setActiveGrade(g)}>
              {g === "All" ? "All Grades" : g}
            </button>
          ))}
        </div>
      )}

      {/* Books — circle style */}
      {filtered.length === 0 ? (
        <div className="tb-empty">
          <span>{icon}</span>
          <h2>{urlSubject ? `No ${urlSubject} textbook uploaded yet` : "No textbooks uploaded yet"}</h2>
          <p>{isAdmin
            ? "Use the upload button above to add the textbook."
            : "Your admin will upload the textbook here. Check back soon."}</p>
        </div>
      ) : (
        <div className="tb-circles-grid">
          {filtered.map((book, i) => {
            const subIcon = book.subject === "Citizenship"
              ? <img src="https://flagcdn.com/w40/ss.png" alt="SS Flag" style={{ width:36, height:24, borderRadius:3, objectFit:"cover" }} onError={e=>{e.target.onerror=null;e.target.style.display="none";}} />
              : (subjectIcons[book.subject] ?? "📚");
            const colors = [
              { bg:"#e3f2fd", border:"#1565c0" },
              { bg:"#e8f5e9", border:"#2e7d32" },
              { bg:"#fce4ec", border:"#c62828" },
              { bg:"#fff3e0", border:"#e65100" },
              { bg:"#f3e5f5", border:"#6a1b9a" },
              { bg:"#e0f7fa", border:"#006064" },
              { bg:"#f9fbe7", border:"#558b2f" },
              { bg:"#fff8e1", border:"#f57f17" },
            ];
            const c = colors[i % colors.length];
            return (
              <a key={book.filename || i}
                href={`${API_BASE}${book.url}`}
                target="_blank" rel="noreferrer"
                className="tb-circle-item">
                <div className="tb-circle-wrap" style={{ background: c.bg, borderColor: c.border }}>
                  <div className="tb-circle-grade" style={{ background: c.border }}>
                    {(book.grade || "").replace("Senior ","S")}
                  </div>
                  <span className="tb-circle-emoji">{subIcon}</span>
                </div>
                <div className="tb-circle-label">{book.subject}</div>
                <div className="tb-circle-grade-label">{book.grade}</div>
                <div className="tb-circle-read-btn" style={{ background: c.border }}>📖 Read</div>
                {isAdmin && (
                  <button className="tb-circle-del" onClick={(e) => { e.preventDefault(); deleteBook(book); }}>🗑️</button>
                )}
              </a>
            );
          })}
        </div>
      )}

      {/* ── MORE RESOURCES (always shown when coming from a subject) ── */}
      {urlSubject && (
        <div className="submod-bottom">
          <h2 className="submod-bottom-title">📌 More Resources for {urlSubject}</h2>
          <div className="submod-bottom-grid">

            <button className="submod-bottom-card green"
              onClick={() => navigate(`/module/${encodeURIComponent(urlSubject)}/${urlGrade || 1}/1?tab=notes`)}>
              <span>📖</span>
              <strong>Full Notes</strong>
              <p>Read chapter notes for {urlSubject}</p>
            </button>

            <a href={ytUrl(urlSubject)} target="_blank" rel="noreferrer" className="submod-bottom-card red">
              <span><YouTubeIcon size={28} /></span>
              <strong>YouTube Tutorials</strong>
              <p>Watch video lessons for {urlSubject}</p>
            </a>

            <button className="submod-bottom-card blue"
              onClick={() => navigate(`/module/${encodeURIComponent(urlSubject)}/${urlGrade || 1}/1?tab=quiz`)}>
              <span>📝</span>
              <strong>Quizzes &amp; Exams</strong>
              <p>Test yourself on {urlSubject}</p>
            </button>

            <button className="submod-bottom-card orange"
              onClick={() => navigate(`/module/${encodeURIComponent(urlSubject)}/${urlGrade || 1}/1?tab=qa`)}>
              <span>❓</span>
              <strong>Q&amp;A Discussion</strong>
              <p>Discussion questions and answers</p>
            </button>

            <button className="submod-bottom-card teal"
              onClick={() => navigate("/past-papers")}>
              <span>📄</span>
              <strong>Past Papers</strong>
              <p>Download past exam papers for {urlSubject}</p>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
