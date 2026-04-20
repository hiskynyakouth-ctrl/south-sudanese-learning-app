import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const GRADES = ["Senior 1","Senior 2","Senior 3","Senior 4"];
const GRADE_MAP = { "Senior 1":1,"Senior 2":2,"Senior 3":3,"Senior 4":4 };

const subjectIcon = {
  Mathematics:"📐",English:"📖",Biology:"🧬",Chemistry:"⚗️",Physics:"⚡",
  History:"🏛️",Geography:"🌍",Economics:"💰",CRE:"✝️",Citizenship:"🇸🇸",
  Agriculture:"🌱","Computer Studies":"💻",Accounting:"📊",
  "English Literature":"📜","Fine Art":"🎨","Additional Mathematics":"🔢",
  "Christian Religious Education":"✝️",
};

const LS_KEY = "ss_textbooks";
const getLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)||"[]"); } catch { return []; } };
const setLocal = (d) => localStorage.setItem(LS_KEY, JSON.stringify(d));

export default function Textbooks() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

  const [books, setBooks] = useState([]);
  const [activeGrade, setActiveGrade] = useState("All");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject:"", grade:"Senior 1", description:"" });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef();

  useEffect(() => { loadBooks(); }, []);

  const loadBooks = async () => {
    try {
      const res = await api.get("/upload/list/textbooks");
      // Merge with local metadata
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
      const res = await api.post("/upload/textbook", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Save metadata locally
      const entry = {
        filename: res.data.filename,
        url: res.data.url,
        subject: form.subject,
        grade: form.grade,
        grade_id: GRADE_MAP[form.grade],
        description: form.description,
        originalName: res.data.originalName,
        size: res.data.size,
        uploadedAt: new Date().toISOString(),
      };
      const updated = [...getLocal(), entry];
      setLocal(updated);
      setBooks(updated);
      setForm({ subject:"", grade:"Senior 1", description:"" });
      setSelectedFile(null);
      setShowForm(false);
      flash(`"${form.subject}" uploaded successfully!`);
    } catch (err) {
      flash(err.response?.data?.error || "Upload failed. Make sure the server is running.");
    } finally {
      setUploading(false);
    }
  };

  const deleteBook = async (book) => {
    if (!window.confirm(`Delete "${book.subject}"?`)) return;
    try { await api.delete(`/upload/textbooks/${book.filename}`); } catch {}
    const updated = getLocal().filter(b => b.filename !== book.filename);
    setLocal(updated);
    setBooks(updated);
    flash("Textbook deleted.");
  };

  const filtered = activeGrade === "All"
    ? books
    : books.filter(b => b.grade === activeGrade);

  const API_BASE = process.env.REACT_APP_API_URL?.replace("/api","") || "http://localhost:5001";

  return (
    <div className="tb-upload-shell">

      {/* Header */}
      <div className="tb-upload-header">
        <span className="eyebrow">Official South Sudan Ministry of Education</span>
        <h1>📚 Textbooks &amp; PDFs</h1>
        <p>Browse and read official South Sudan secondary school textbooks uploaded by your school.</p>
        {msg && <div className="admin-msg">{msg}</div>}
      </div>

      {/* Admin upload button */}
      {isAdmin && (
        <button className="tb-upload-trigger" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "⬆️ Upload New Textbook"}
        </button>
      )}

      {/* Upload form */}
      {isAdmin && showForm && (
        <div className="tb-upload-form-card">
          <h2>⬆️ Upload Textbook PDF</h2>
          <form onSubmit={handleUpload} className="tb-upload-form">
            <div className="admin-field">
              <label>Subject Name</label>
              <input className="admin-input" placeholder="e.g. Biology, Mathematics, English"
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
                  : <><span>📁</span><strong>Click to select PDF</strong><small>or drag and drop here</small></>
                }
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

      {/* Grade filter */}
      <div className="filter-row">
        {["All", ...GRADES].map(g => (
          <button key={g} className={`filter-pill${activeGrade===g?" active":""}`}
            onClick={() => setActiveGrade(g)}>
            {g === "All" ? "All Grades" : g}
          </button>
        ))}
      </div>

      {/* Books grid */}
      {filtered.length === 0 ? (
        <div className="tb-empty">
          <span>📚</span>
          <h2>No textbooks uploaded yet</h2>
          <p>{isAdmin ? "Use the upload button above to add your first textbook." : "Your admin will upload textbooks here. Check back soon."}</p>
        </div>
      ) : (
        <div className="tb-books-grid">
          {filtered.map((book, i) => (
            <div key={book.filename || i} className="tb-book-card">
              <div className="tb-book-icon-wrap">
                <span className="tb-book-icon">{subjectIcon[book.subject] ?? "📚"}</span>
                <span className="tb-book-grade-badge">{book.grade?.replace("Senior","S")}</span>
              </div>
              <div className="tb-book-info">
                <strong>{book.subject}</strong>
                <span>{book.grade}</span>
                {book.description && <p>{book.description}</p>}
                {book.originalName && <small>📄 {book.originalName}</small>}
              </div>
              <div className="tb-book-actions">
                <a
                  href={`${API_BASE}${book.url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="tb-read-btn"
                >
                  📖 Read PDF
                </a>
                <a
                  href={`${API_BASE}${book.url}`}
                  download
                  className="tb-dl-btn"
                >
                  ⬇️ Download
                </a>
                {isAdmin && (
                  <button className="admin-del-btn" onClick={() => deleteBook(book)}>🗑️</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
