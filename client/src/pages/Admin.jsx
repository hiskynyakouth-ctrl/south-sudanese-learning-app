import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { IconTrash, IconEdit } from "../components/Icons";

// ── Constants ──────────────────────────────────────────────────────────────
const GRADES = ["Senior 1", "Senior 2", "Senior 3", "Senior 4"];
const GRADE_MAP = { "Senior 1": 1, "Senior 2": 2, "Senior 3": 3, "Senior 4": 4 };
const STREAMS = ["None (Core)", "Natural Sciences", "Social Sciences"];
const STREAM_MAP = { "None (Core)": null, "Natural Sciences": 1, "Social Sciences": 2 };
const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const PAPERS = ["Paper 1", "Paper 2", "Paper 3"];

const needsStream = (grade) => grade === "Senior 3" || grade === "Senior 4";

// ── Local storage helpers ──────────────────────────────────────────────────
const LS_USERS    = "ss_users";
const LS_SUBJECTS = "ss_admin_subjects";
const LS_PAPERS   = "ss_admin_papers";

const lsGet = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const lsSet = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ── Sidebar tabs ───────────────────────────────────────────────────────────
const TABS = [
  { key: "dashboard", label: "Dashboard",   icon: "📊" },
  { key: "users",     label: "Users",        icon: "👥" },
  { key: "subjects",  label: "Subjects",     icon: "📚" },
  { key: "papers",    label: "Past Papers",  icon: "📄" },
  { key: "settings",  label: "Settings",     icon: "⚙" },
];

// ── Default form states ────────────────────────────────────────────────────
const defaultSubject = { name: "", grade: "Senior 1", stream: "None (Core)" };
const defaultPaper   = { subject: "", grade: "Senior 1", year: "2024", paper: "Paper 1", title: "", url: "" };

// ── Helpers ────────────────────────────────────────────────────────────────
const streamLabel = (s) => {
  if (!s) return "Core";
  if (s === 1 || s === "Natural Sciences") return "Natural Sciences";
  if (s === 2 || s === "Social Sciences")  return "Social Sciences";
  return "Core";
};

const streamClass = (label) => {
  if (label === "Natural Sciences") return "admin-stream-tag natural";
  if (label === "Social Sciences")  return "admin-stream-tag social";
  return "admin-stream-tag core";
};

// ── Component ──────────────────────────────────────────────────────────────
export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tab,      setTab]      = useState("dashboard");
  const [stats,    setStats]    = useState({ users: 0, subjects: 0, chapters: 0, papers: 0 });
  const [users,    setUsers]    = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [papers,   setPapers]   = useState([]);
  const [dbOnline, setDbOnline] = useState(null);
  const [msg,      setMsg]      = useState("");

  // Subject form / edit state
  const [ns,          setNs]          = useState(defaultSubject);
  const [editSubject, setEditSubject] = useState(null);

  // Paper form
  const [np, setNp] = useState(defaultPaper);

  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!isAdmin)          { navigate("/");      return; }
    loadAll();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Data loading ───────────────────────────────────────────────────────
  const loadAll = async () => {
    try {
      const [sRes, uRes, subRes, papRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/subjects"),
        api.get("/admin/past-papers"),
      ]);
      setDbOnline(true);
      setStats({
        users:    parseInt(sRes.data.users)    || 0,
        subjects: parseInt(sRes.data.subjects) || 0,
        chapters: parseInt(sRes.data.chapters) || 0,
        papers:   parseInt(sRes.data.papers)   || 0,
      });
      setUsers(uRes.data);
      setSubjects(subRes.data);
      setPapers(papRes.data || []);
    } catch {
      setDbOnline(false);
      const lu = lsGet(LS_USERS).map(u => ({ ...u, role: u.role || "student" }));
      const ls = lsGet(LS_SUBJECTS);
      const lp = lsGet(LS_PAPERS);
      setUsers(lu);
      setSubjects(ls);
      setPapers(lp);
      setStats({ users: lu.length, subjects: ls.length, chapters: 0, papers: lp.length });
    }
  };

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };

  // ── Users ──────────────────────────────────────────────────────────────
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try { await api.delete(`/admin/users/${id}`); } catch { /* offline */ }
    const updated = lsGet(LS_USERS).filter(u => u.id !== id);
    lsSet(LS_USERS, updated);
    setUsers(u => u.filter(x => x.id !== id));
    flash("User deleted.");
  };

  const changeRole = async (id, role) => {
    try { await api.put(`/admin/users/${id}/role`, { role }); } catch { /* offline */ }
    setUsers(u => u.map(x => x.id === id ? { ...x, role } : x));
    flash("Role updated.");
  };

  // ── Subjects ───────────────────────────────────────────────────────────
  const addSubject = async (e) => {
    e.preventDefault();
    if (!ns.name.trim()) return;
    const grade_id  = GRADE_MAP[ns.grade];
    const stream_id = needsStream(ns.grade) ? STREAM_MAP[ns.stream] : null;
    const entry = {
      id: Date.now(), name: ns.name, grade_id, stream_id,
      grade_name: ns.grade,
      stream_name: stream_id ? ns.stream : "Core",
    };
    try {
      await api.post("/admin/subjects", { name: ns.name, grade_id, stream_id });
      flash(`"${ns.name}" added to ${ns.grade}${stream_id ? " — " + ns.stream : " (Core)"}`);
      loadAll();
    } catch {
      const updated = [...lsGet(LS_SUBJECTS), entry];
      lsSet(LS_SUBJECTS, updated);
      setSubjects(updated);
      flash(`"${ns.name}" saved locally to ${ns.grade}`);
    }
    setNs(defaultSubject);
  };

  const saveEditSubject = async (e) => {
    e.preventDefault();
    const grade_id  = GRADE_MAP[editSubject.grade_name];
    const stream_id = needsStream(editSubject.grade_name) ? STREAM_MAP[editSubject.stream_name] : null;
    const updated_entry = { ...editSubject, grade_id, stream_id };
    try {
      await api.put(`/admin/subjects/${editSubject.id}`, { name: editSubject.name, grade_id, stream_id });
      flash("Subject updated.");
      loadAll();
    } catch {
      const updated = lsGet(LS_SUBJECTS).map(s => s.id === editSubject.id ? updated_entry : s);
      lsSet(LS_SUBJECTS, updated);
      setSubjects(updated);
      flash("Subject updated locally.");
    }
    setEditSubject(null);
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try { await api.delete(`/admin/subjects/${id}`); } catch { /* offline */ }
    const updated = lsGet(LS_SUBJECTS).filter(s => s.id !== id);
    lsSet(LS_SUBJECTS, updated);
    setSubjects(s => s.filter(x => x.id !== id));
    flash("Subject deleted.");
  };

  // ── Papers ─────────────────────────────────────────────────────────────
  const autoTitle = (p) =>
    p.subject ? `${p.subject} ${p.year} — ${p.paper}` : "";

  const addPaper = async (e) => {
    e.preventDefault();
    if (!np.subject.trim() || !np.url.trim()) return;
    const title = np.title || autoTitle(np);
    const entry = {
      id: Date.now(), subject: np.subject, grade: np.grade,
      year: parseInt(np.year), paper: np.paper, title, url: np.url,
    };
    try {
      await api.post("/admin/past-papers", {
        subject_id: null, year: parseInt(np.year), title, file_url: np.url,
      });
      flash(`"${title}" added to ${np.grade}`);
      loadAll();
    } catch {
      const updated = [...lsGet(LS_PAPERS), entry];
      lsSet(LS_PAPERS, updated);
      setPapers(updated);
      flash(`"${title}" saved locally to ${np.grade}`);
    }
    setNp(defaultPaper);
  };

  const deletePaper = async (id) => {
    if (!window.confirm("Delete this paper?")) return;
    try { await api.delete(`/admin/past-papers/${id}`); } catch { /* offline */ }
    const updated = lsGet(LS_PAPERS).filter(p => p.id !== id);
    lsSet(LS_PAPERS, updated);
    setPapers(p => p.filter(x => x.id !== id));
    flash("Paper deleted.");
  };

  // ── Derived groupings ──────────────────────────────────────────────────
  const subjectsByGrade = GRADES.reduce((acc, g) => {
    acc[g] = subjects.filter(s =>
      s.grade_name === g || GRADE_MAP[g] === s.grade_id
    );
    return acc;
  }, {});

  const papersByGrade = GRADES.reduce((acc, g) => {
    acc[g] = papers.filter(p => p.grade === g);
    return acc;
  }, {});

  // ── Active subject form values (add vs edit) ───────────────────────────
  const sf = editSubject || null;
  const sfGrade  = sf ? sf.grade_name  : ns.grade;
  const sfStream = sf ? sf.stream_name : ns.stream;
  const sfName   = sf ? sf.name        : ns.name;

  const setsfName   = (v) => sf ? setEditSubject(s => ({ ...s, name: v }))        : setNs(s => ({ ...s, name: v }));
  const setsfGrade  = (v) => sf ? setEditSubject(s => ({ ...s, grade_name: v }))  : setNs(s => ({ ...s, grade: v }));
  const setsfStream = (v) => sf ? setEditSubject(s => ({ ...s, stream_name: v })) : setNs(s => ({ ...s, stream: v }));

  const subjectPreview = needsStream(sfGrade)
    ? `${sfGrade} → ${sfStream}`
    : `${sfGrade} → Core Subjects`;

  const paperPreview = `${np.grade} → ${np.subject || "Subject"} → ${np.year} → ${np.paper}`;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="admin-shell">

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="https://flagcdn.com/w40/ss.png" alt="South Sudan" style={{ width: 32, borderRadius: 6 }} />
          <div>
            <strong>Admin Panel</strong>
            <small>{user?.name || user?.email}</small>
          </div>
        </div>

        <nav className="admin-nav">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`admin-nav-btn${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        <button
          className="admin-nav-btn"
          style={{ marginTop: "auto", color: "var(--muted)" }}
          onClick={() => navigate("/")}
        >
          ← Back to Site
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">

        {/* Status banners */}
        {msg && <div className="admin-msg">{msg}</div>}

        {dbOnline === false && (
          <div className="admin-offline-banner">
            <span>⚠️</span>
            <div>
              <strong>Backend offline — using local storage</strong>
              <p>Start server: <code>cd server &amp;&amp; node index.js</code></p>
            </div>
            <button className="primary-button" style={{ flexShrink: 0 }} onClick={loadAll}>
              Retry
            </button>
          </div>
        )}

        {dbOnline === true && (
          <div className="admin-online-banner">
            <span>🟢</span>
            <strong>PostgreSQL Connected — south sudan e-learning</strong>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            DASHBOARD
        ════════════════════════════════════════════════════════════ */}
        {tab === "dashboard" && (
          <div className="admin-section">
            <h1>📊 Dashboard</h1>
            <p>Welcome back, <strong>{user?.name || "Admin"}</strong></p>

            <div className="admin-stats-grid">
              {[
                { label: "Total Users",  value: stats.users,    icon: "👥", color: "#1565c0" },
                { label: "Subjects",     value: stats.subjects, icon: "📚", color: "#2e7d32" },
                { label: "Chapters",     value: stats.chapters, icon: "📖", color: "#e65100" },
                { label: "Past Papers",  value: stats.papers,   icon: "📄", color: "#6a1b9a" },
              ].map(s => (
                <div key={s.label} className="admin-stat-card" style={{ borderTopColor: s.color }}>
                  <span className="admin-stat-icon">{s.icon}</span>
                  <div className="admin-stat-num" style={{ color: s.color }}>{s.value}</div>
                  <div className="admin-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="admin-quick-actions">
              <h2>Quick Actions</h2>
              <div className="admin-action-grid">
                {[
                  { label: "Manage Users",   icon: "👥", tab: "users"     },
                  { label: "Add Subject",    icon: "+", tab: "subjects"  },
                  { label: "Add Past Paper", icon: "📄", tab: "papers"    },
                  { label: "Settings",       icon: "⚙", tab: "settings"  },
                ].map(a => (
                  <button key={a.label} className="admin-action-btn" onClick={() => setTab(a.tab)}>
                    <span>{a.icon}</span>
                    <strong>{a.label}</strong>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            USERS
        ════════════════════════════════════════════════════════════ */}
        {tab === "users" && (
          <div className="admin-section">
            <h1>👥 Users <span style={{ fontWeight: 400, fontSize: "1rem" }}>({users.length})</span></h1>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id}>
                      <td>{i + 1}</td>
                      <td><strong>{u.name || "—"}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <select
                          className="admin-select"
                          value={u.role || "student"}
                          onChange={e => changeRole(u.id, e.target.value)}
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                      <td>
                        <button className="admin-del-btn" onClick={() => deleteUser(u.id)} title="Delete user">
                          <IconTrash size={14}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="admin-empty">No users yet. Register at /register to see them here.</p>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            SUBJECTS
        ════════════════════════════════════════════════════════════ */}
        {tab === "subjects" && (
          <div className="admin-section">
            <h1>📚 Subject Management</h1>

            {/* ── Add / Edit form ── */}
            <div className="admin-form-card">
              <h2>{editSubject ? "Edit Subject" : "Add New Subject"}</h2>
              <form className="admin-form-grid" onSubmit={editSubject ? saveEditSubject : addSubject}>

                {/* Subject name */}
                <div className="admin-field">
                  <label>Subject Name</label>
                  <input
                    className="admin-input"
                    placeholder="e.g. Biology, English, Physics"
                    value={sfName}
                    onChange={e => setsfName(e.target.value)}
                    required
                  />
                </div>

                {/* Grade */}
                <div className="admin-field">
                  <label>Grade</label>
                  <select
                    className="admin-select admin-select-lg"
                    value={sfGrade}
                    onChange={e => setsfGrade(e.target.value)}
                  >
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>

                {/* Stream */}
                <div className="admin-field">
                  <label>
                    Stream{" "}
                    {!needsStream(sfGrade) && (
                      <span className="admin-badge-core">Core — no stream</span>
                    )}
                  </label>
                  <select
                    className="admin-select admin-select-lg"
                    disabled={!needsStream(sfGrade)}
                    value={sfStream}
                    onChange={e => setsfStream(e.target.value)}
                  >
                    {STREAMS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Preview */}
                <div className="admin-field admin-field-preview">
                  <label>Will appear in</label>
                  <div className="admin-preview-tag">{subjectPreview}</div>
                </div>

                {/* Actions */}
                <div className="admin-form-actions">
                  <button type="submit" className="primary-button">
                    {editSubject ? "Save Changes" : "Add Subject"}
                  </button>
                  {editSubject && (
                    <button type="button" className="ghost-button" onClick={() => setEditSubject(null)}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* ── Subjects grouped by grade ── */}
            {GRADES.map(grade => {
              const list = subjectsByGrade[grade] || [];
              if (list.length === 0) return null;
              return (
                <div key={grade} className="admin-grade-block">
                  <div className="admin-grade-header">
                    <span className="admin-grade-badge">{grade}</span>
                    <span>{list.length} subject{list.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="admin-subject-cards">
                    {list.map(s => {
                      const sl = streamLabel(s.stream_id ?? s.stream_name);
                      return (
                        <div key={s.id} className="admin-subject-card">
                          <div className="admin-subject-info">
                            <strong>{s.name}</strong>
                            <span className={streamClass(sl)}>{sl}</span>
                          </div>
                          <div className="admin-subject-actions">
                            <button
                              className="admin-edit-btn"
                              title="Edit subject"
                              onClick={() => setEditSubject({
                                ...s,
                                grade_name:  s.grade_name  || grade,
                                stream_name: s.stream_name || streamLabel(s.stream_id),
                              })}
                            >
                              <IconEdit size={14}/>
                            </button>
                            <button
                              className="admin-del-btn"
                              title="Delete subject"
                              onClick={() => deleteSubject(s.id)}
                            >
                              <IconTrash size={14}/>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {subjects.length === 0 && (
              <p className="admin-empty">No subjects yet. Use the form above to add your first subject.</p>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            PAST PAPERS
        ════════════════════════════════════════════════════════════ */}
        {tab === "papers" && (
          <div className="admin-section">
            <h1>📄 Past Papers Management</h1>

            {/* ── Add paper form ── */}
            <div className="admin-form-card">
              <h2>Add New Past Paper</h2>
              <form className="admin-form-grid" onSubmit={addPaper}>

                {/* Subject */}
                <div className="admin-field">
                  <label>Subject Name</label>
                  <input
                    className="admin-input"
                    placeholder="e.g. Physics, Biology, Mathematics"
                    value={np.subject}
                    onChange={e => setNp(p => ({
                      ...p,
                      subject: e.target.value,
                      title: `${e.target.value} ${p.year} — ${p.paper}`,
                    }))}
                    required
                  />
                </div>

                {/* Grade */}
                <div className="admin-field">
                  <label>Grade</label>
                  <select
                    className="admin-select admin-select-lg"
                    value={np.grade}
                    onChange={e => setNp(p => ({ ...p, grade: e.target.value }))}
                  >
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>

                {/* Year */}
                <div className="admin-field">
                  <label>Year</label>
                  <select
                    className="admin-select admin-select-lg"
                    value={np.year}
                    onChange={e => setNp(p => ({
                      ...p,
                      year: e.target.value,
                      title: `${p.subject} ${e.target.value} — ${p.paper}`,
                    }))}
                  >
                    {YEARS.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>

                {/* Paper number */}
                <div className="admin-field">
                  <label>Paper Number</label>
                  <select
                    className="admin-select admin-select-lg"
                    value={np.paper}
                    onChange={e => setNp(p => ({
                      ...p,
                      paper: e.target.value,
                      title: `${p.subject} ${p.year} — ${e.target.value}`,
                    }))}
                  >
                    {PAPERS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>

                {/* Title (full width) */}
                <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
                  <label>Title (auto-filled)</label>
                  <input
                    className="admin-input"
                    placeholder="Auto-generated from fields above"
                    value={np.title}
                    onChange={e => setNp(p => ({ ...p, title: e.target.value }))}
                  />
                </div>

                {/* PDF URL (full width) */}
                <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
                  <label>PDF URL (Scribd, Google Drive, or direct link)</label>
                  <input
                    className="admin-input"
                    placeholder="https://www.scribd.com/document/..."
                    value={np.url}
                    onChange={e => setNp(p => ({ ...p, url: e.target.value }))}
                    required
                  />
                </div>

                {/* Preview */}
                <div className="admin-field admin-field-preview">
                  <label>Will appear in</label>
                  <div className="admin-preview-tag">{paperPreview}</div>
                </div>

                <div className="admin-form-actions">
                  <button type="submit" className="primary-button">Add Past Paper</button>
                </div>
              </form>
            </div>

            {/* ── Papers grouped by grade → year ── */}
            {GRADES.map(grade => {
              const gradePapers = papersByGrade[grade] || [];
              if (gradePapers.length === 0) return null;

              const byYear = YEARS.reduce((acc, y) => {
                acc[y] = gradePapers.filter(p => p.year === y || p.year === String(y));
                return acc;
              }, {});

              return (
                <div key={grade} className="admin-grade-block">
                  <div className="admin-grade-header">
                    <span className="admin-grade-badge">{grade}</span>
                    <span>{gradePapers.length} paper{gradePapers.length !== 1 ? "s" : ""}</span>
                  </div>

                  {YEARS.filter(y => (byYear[y] || []).length > 0).map(year => (
                    <div key={year} className="admin-year-block">
                      <div className="admin-year-label">{year}</div>
                      <div className="admin-paper-cards">
                        {(byYear[year] || []).map(p => (
                          <div key={p.id} className="admin-paper-card">
                            <div className="admin-paper-info">
                              <strong>{p.title || autoTitle(p)}</strong>
                              <span>{p.subject} · {p.paper}</span>
                              {p.url && (
                                <a
                                  href={p.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="admin-paper-link"
                                >
                                  View PDF →
                                </a>
                              )}
                            </div>
                            <button
                              className="admin-del-btn"
                              title="Delete paper"
                              onClick={() => deletePaper(p.id)}
                            >
                              <IconTrash size={14}/>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}

            {papers.length === 0 && (
              <p className="admin-empty">No past papers added yet. Use the form above to add papers.</p>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            SETTINGS
        ════════════════════════════════════════════════════════════ */}
        {tab === "settings" && (
          <div className="admin-section">
            <h1>Settings</h1>

            {/* Session info */}
            <div className="admin-status-card">
              <div className="admin-status-row">
                <span className="admin-status-dot green" />
                <strong>Admin Session Active</strong>
              </div>
              <div className="admin-status-grid">
                <div><span>Name</span>  <strong>{user?.name  || "—"}</strong></div>
                <div><span>Email</span> <strong>{user?.email || "—"}</strong></div>
                <div><span>Role</span>  <strong style={{ color: "#1a73e8" }}>{user?.role || "admin"}</strong></div>
                <div><span>Access</span><strong style={{ color: "#2e7d32" }}>Full Admin</strong></div>
              </div>
            </div>

            <div className="admin-settings-grid">

              {/* DB test */}
              <div className="admin-setting-card">
                <h3>Database</h3>
                <p>PostgreSQL · <strong>south sudan e-learning</strong></p>
                <p>Host: localhost:5432</p>
                <button
                  className="primary-button"
                  onClick={() =>
                    api.get("/admin/stats")
                      .then(r => alert(`Connected!\nUsers: ${r.data.users}\nSubjects: ${r.data.subjects}`))
                      .catch(() => alert("Offline. Run: cd server && node index.js"))
                  }
                >
                  Test Connection
                </button>
              </div>

              {/* Set admin role */}
              <div className="admin-setting-card">
                <h3>Set Admin Role</h3>
                <p>Promote your current account to admin in local storage.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    const raw = localStorage.getItem("sslauth");
                    if (!raw) { alert("Not logged in."); return; }
                    const s = JSON.parse(raw);
                    s.user.role = "admin";
                    localStorage.setItem("sslauth", JSON.stringify(s));
                    alert("Done! Refresh the page.");
                  }}
                >
                  Set My Role to Admin
                </button>
              </div>

              {/* Backup */}
              <div className="admin-setting-card">
                <h3>Backup</h3>
                <p>Export all local data to a JSON file.</p>
                <button
                  className="primary-button"
                  onClick={() => {
                    const data = {
                      users:    lsGet(LS_USERS),
                      subjects: lsGet(LS_SUBJECTS),
                      papers:   lsGet(LS_PAPERS),
                      exported: new Date().toISOString(),
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = "ss_backup.json";
                    a.click();
                  }}
                >
                  Download Backup
                </button>
              </div>

              {/* Platform info */}
              <div className="admin-setting-card">
                <h3>Platform</h3>
                <p>South Sudan E-Learning · v1.0.0</p>
                <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                  Senior 1–4 · 15+ subjects · AI Tutor
                </p>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
