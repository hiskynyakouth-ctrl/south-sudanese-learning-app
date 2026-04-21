import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const GRADES = ["Senior 1","Senior 2","Senior 3","Senior 4"];
const YEARS  = [2026,2025,2024,2023,2022,2021,2020];
const PAPERS = ["Paper 1","Paper 2","Paper 3"];

const subjectIcon = {
  Physics:"⚡",Biology:"🧬",Mathematics:"📐",English:"📖",Chemistry:"⚗️",
  History:"🏛️",Geography:"🌍",Economics:"💰",CRE:"✝️",
  "Computer Studies":"💻",Agriculture:"🌱",Accounting:"📊",
  "English Literature":"📜","Fine Art":"🎨","Additional Mathematics":"🔢",
};

const getCitizenshipFlag = () => (
  <img src="https://flagcdn.com/w40/ss.png" alt="South Sudan"
    style={{ width:28, height:19, borderRadius:3, objectFit:"cover", verticalAlign:"middle" }}
    onError={e => { e.target.onerror=null; e.target.style.display="none"; }} />
);

const getIcon = (subject) => {
  if (subject === "Citizenship") return getCitizenshipFlag();
  return subjectIcon[subject] ?? "📄";
};

const LS_KEY = "ss_papers";
const getLocal = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)||"[]"); } catch { return []; } };
const setLocal = (d) => localStorage.setItem(LS_KEY, JSON.stringify(d));

export default function PastPapers() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

  const [papers, setPapers] = useState([]);
  const [activeGrade, setActiveGrade] = useState("All");
  const [activeYear, setActiveYear] = useState("All");
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject:"", grade:"Senior 1", year:"2024", paper:"Paper 1" });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef();

  useEffect(() => { loadPapers(); }, []);

  const loadPapers = async () => {
    try {
      const res = await api.get("/upload/list/papers");
      const local = getLocal();
      const merged = res.data.map(f => {
        const meta = local.find(l => l.filename === f.filename) || {};
        return { ...f, ...meta };
      });
      setPapers(merged);
    } catch {
      setPapers(getLocal());
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
      const res = await api.post("/upload/paper", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const entry = {
        filename: res.data.filename,
        url: res.data.url,
        subject: form.subject,
        grade: form.grade,
        year: parseInt(form.year),
        paper: form.paper,
        title: `${form.subject} ${form.year} — ${form.paper}`,
        originalName: res.data.originalName,
        size: res.data.size,
        uploadedAt: new Date().toISOString(),
      };
      const updated = [...getLocal(), entry];
      setLocal(updated);
      setPapers(updated);
      setForm({ subject:"", grade:"Senior 1", year:"2024", paper:"Paper 1" });
      setSelectedFile(null);
      setShowForm(false);
      flash(`"${entry.title}" uploaded successfully!`);
    } catch (err) {
      flash(err.response?.data?.error || "Upload failed. Make sure the server is running.");
    } finally {
      setUploading(false);
    }
  };

  const deletePaper = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    try { await api.delete(`/upload/papers/${p.filename}`); } catch {}
    const updated = getLocal().filter(x => x.filename !== p.filename);
    setLocal(updated);
    setPapers(updated);
    flash("Paper deleted.");
  };

  const filtered = papers.filter(p => {
    const gMatch = activeGrade === "All" || p.grade === activeGrade;
    const yMatch = activeYear === "All" || p.year === parseInt(activeYear);
    return gMatch && yMatch;
  });

  // Group by grade → year
  const grouped = GRADES.reduce((acc, g) => {
    const gp = filtered.filter(p => p.grade === g);
    if (gp.length === 0) return acc;
    acc[g] = YEARS.reduce((ya, y) => {
      const yp = gp.filter(p => p.year === y);
      if (yp.length > 0) ya[y] = yp;
      return ya;
    }, {});
    return acc;
  }, {});

  const API_BASE = process.env.REACT_APP_API_URL?.replace("/api","") || "http://localhost:5001";

  return (
    <div className="tb-upload-shell">

      <div className="tb-upload-header">
        <span className="eyebrow">South Sudan National Examinations — SSSCE / SSCE</span>
        <h1>📄 Past Examination Papers</h1>
        <p>Browse and download past papers uploaded by your school. Filter by grade and year.</p>
        {msg && <div className="admin-msg">{msg}</div>}
      </div>

      {/* Admin upload */}
      {isAdmin && (
        <button className="tb-upload-trigger" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "⬆️ Upload New Past Paper"}
        </button>
      )}

      {isAdmin && showForm && (
        <div className="tb-upload-form-card">
          <h2>⬆️ Upload Past Paper PDF</h2>
          <form onSubmit={handleUpload} className="tb-upload-form">
            <div className="admin-field">
              <label>Subject Name</label>
              <input className="admin-input" placeholder="e.g. Physics, Biology, Mathematics"
                value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} required />
            </div>
            <div className="admin-field">
              <label>Grade</label>
              <select className="admin-select admin-select-lg" value={form.grade}
                onChange={e => setForm(f => ({...f, grade: e.target.value}))}>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label>Year</label>
              <select className="admin-select admin-select-lg" value={form.year}
                onChange={e => setForm(f => ({...f, year: e.target.value}))}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label>Paper Number</label>
              <select className="admin-select admin-select-lg" value={form.paper}
                onChange={e => setForm(f => ({...f, paper: e.target.value}))}>
                {PAPERS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="admin-field" style={{ gridColumn:"1/-1" }}>
              <label>PDF File (max 20MB)</label>
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
                {uploading ? "Uploading..." : "Upload Paper"}
              </button>
              <button type="button" className="ghost-button" onClick={() => { setShowForm(false); setSelectedFile(null); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div style={{ display:"grid", gap:12 }}>
        <div className="filter-row">
          <span className="filter-label">Grade:</span>
          {["All",...GRADES].map(g => (
            <button key={g} className={`filter-pill${activeGrade===g?" active":""}`}
              onClick={() => setActiveGrade(g)}>{g === "All" ? "All Grades" : g}</button>
          ))}
        </div>
        <div className="filter-row">
          <span className="filter-label">Year:</span>
          {["All",...YEARS].map(y => (
            <button key={y} className={`filter-pill${activeYear===String(y)?" active":""}`}
              onClick={() => setActiveYear(String(y))}>{y}</button>
          ))}
        </div>
      </div>

      {/* Papers grouped */}
      {Object.keys(grouped).length === 0 ? (
        <div className="tb-empty">
          <span>📄</span>
          <h2>No past papers uploaded yet</h2>
          <p>{isAdmin ? "Use the upload button above to add past papers." : "Your admin will upload past papers here. Check back soon."}</p>
        </div>
      ) : (
        <div style={{ display:"grid", gap:28 }}>
          {Object.entries(grouped).map(([grade, byYear]) => (
            <div key={grade} className="admin-grade-block">
              <div className="admin-grade-header">
                <span className="admin-grade-badge">{grade}</span>
                <span>{Object.values(byYear).flat().length} papers</span>
              </div>
              {Object.entries(byYear).map(([year, yPapers]) => (
                <div key={year} className="admin-year-block">
                  <div className="admin-year-label">{year}</div>
                  <div className="tb-papers-row">
                    {yPapers.map((p, i) => (
                      <div key={p.filename || i} className="tb-paper-card">
                        <div className="tb-paper-icon">{getIcon(p.subject)}</div>
                        <div className="tb-paper-info">
                          <strong>{p.title || `${p.subject} ${p.year} — ${p.paper}`}</strong>
                          <span>{p.subject} · {p.paper} · {p.year}</span>
                        </div>
                        <div className="tb-paper-btns">
                          <a href={`${API_BASE}${p.url}`} target="_blank" rel="noreferrer" className="tb-read-btn">
                            📖 View
                          </a>
                          <a href={`${API_BASE}${p.url}`} download className="tb-dl-btn">
                            ⬇️ Download
                          </a>
                          {isAdmin && (
                            <button className="admin-del-btn" onClick={() => deletePaper(p)}>🗑️</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
