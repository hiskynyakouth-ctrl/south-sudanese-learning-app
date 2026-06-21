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
  { key: "dashboard",     label: "Dashboard",     icon: "📊" },
  { key: "users",         label: "Users",          icon: "👥" },
  { key: "payments",      label: "Payments",       icon: "🧾" },
  { key: "subscriptions", label: "Subscriptions",  icon: "💳" },
  { key: "subjects",      label: "Subjects",       icon: "📚" },
  { key: "papers",        label: "Past Papers",    icon: "📄" },
  { key: "settings",      label: "Settings",       icon: "⚙" },
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
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tab,      setTab]      = useState("dashboard");
  const [stats,    setStats]    = useState({ users: 0, subjects: 0, chapters: 0, papers: 0 });
  const [users,    setUsers]    = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [papers,   setPapers]   = useState([]);
  const [subs,     setSubs]     = useState([]);
  const [subEmail, setSubEmail] = useState("");
  const [subDays,  setSubDays]  = useState("60");
  const [subPlan,  setSubPlan]  = useState("2-month");
  const [subMsg,   setSubMsg]   = useState("");
  const [dbOnline, setDbOnline] = useState(null);
  const [dbError,   setDbError]  = useState("");
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
  const loadLocalData = (onlineStats = null, onlineUsers = null, onlineSubjects = null, onlinePapers = null) => {
    const localUsers = lsGet(LS_USERS).map(u => ({ ...u, role: u.role || "student" }));
    const localSubjects = lsGet(LS_SUBJECTS);
    const localPapers = lsGet(LS_PAPERS);

    setStats({
      users:    onlineStats ? parseInt(onlineStats.users)    || localUsers.length : localUsers.length,
      subjects: onlineStats ? parseInt(onlineStats.subjects) || localSubjects.length : localSubjects.length,
      chapters: onlineStats ? parseInt(onlineStats.chapters) || 0 : 0,
      papers:   onlineStats ? parseInt(onlineStats.papers)   || localPapers.length : localPapers.length,
    });
    setUsers(onlineUsers || localUsers);
    setSubjects(onlineSubjects || localSubjects);
    setPapers(onlinePapers || localPapers);
  };

  const loadAll = async () => {
    let onlineStats = null;
    let onlineUsers = null;
    let onlineSubjects = null;
    let onlinePapers = null;

    setDbOnline(null);
    setDbError("");

    if (!token?.startsWith("eyJ")) {
      setDbOnline(false);
      setDbError("You are signed in with a local/offline account. Sign in with your online admin account to load data from the server.");
      loadLocalData();
      return;
    }

    try {
      const sRes = await api.get("/admin/stats");
      onlineStats = sRes.data;
      setDbOnline(true);
    } catch (error) {
      setDbOnline(false);
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token is valid JWT but role isn't admin in DB yet — auto-promote and retry
        if (token?.startsWith("eyJ") && user?.email) {
          try {
            await api.post("/auth/promote-admin", {
              secret: "ss_setup_2024_hisky",
              email: user.email,
            });
            // Retry stats after promotion
            try {
              const retryRes = await api.get("/admin/stats");
              onlineStats = retryRes.data;
              setDbOnline(true);
              // fall through to load other data
            } catch {
              setDbError("Auto-promotion succeeded but stats still failed. Please log out and log back in.");
              loadLocalData();
              return;
            }
          } catch {
            setDbError("Your admin session is not authorized. Please sign in again with an admin account.");
            loadLocalData();
            return;
          }
        } else {
          setDbError("Your admin session is not authorized. Please sign in again with an admin account.");
          loadLocalData();
          return;
        }
      } else if (error.response?.status === 503) {
        setDbError(error.response?.data?.error || "The backend is online, but the database is not connected.");
        loadLocalData();
        return;
      } else if (error.code === "ECONNABORTED") {
        setDbError("The backend did not respond within 30 seconds. It may still be starting up.");
      } else if (!error.response) {
        setDbError("The backend is unreachable right now. Check your connection or try again in a moment.");
      } else {
        setDbError(error.response?.data?.error || "The backend returned an error while loading admin data.");
      }
    }

    try {
      const uRes = await api.get("/admin/users");
      onlineUsers = uRes.data;
    } catch {
      // ignore
    }

    try {
      const subRes = await api.get("/admin/subjects");
      onlineSubjects = subRes.data;
    } catch {
      // ignore
    }

    try {
      const papRes = await api.get("/admin/past-papers");
      onlinePapers = papRes.data || [];
    } catch {
      // ignore
    }

    try {
      const subRes = await api.get("/admin/subscriptions");
      setSubs(subRes.data || []);
    } catch {
      // ignore
    }

    try {
      const payRes = await api.get("/admin/payments");
      setPaymentsList(payRes.data || []);
    } catch {
      // ignore
    }

    loadLocalData(onlineStats, onlineUsers, onlineSubjects, onlinePapers);
  };

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };

  const activateSub = async (e) => {
    e.preventDefault();
    if (!subEmail.trim()) { setSubMsg("Enter an email address."); return; }
    try {
      const res = await api.post("/admin/subscriptions/activate", {
        email: subEmail.trim(), plan: subPlan, days: parseInt(subDays) || 60,
      });
      setSubMsg(`✅ ${res.data.message}`);
      setSubEmail("");
      // Refresh subs list
      api.get("/admin/subscriptions").then(r => setSubs(r.data || [])).catch(() => {});
    } catch (err) {
      setSubMsg(`❌ ${err.response?.data?.error || "Activation failed."}`);
    }
    setTimeout(() => setSubMsg(""), 5000);
  };

  const revokeSub = async (id, email) => {
    if (!window.confirm(`Revoke subscription for ${email}?`)) return;
    try {
      await api.delete(`/admin/subscriptions/${id}`);
      setSubs(s => s.map(u => u.id === id ? { ...u, is_subscribed: false, subscription_expiry: null } : u));
      flash("Subscription revoked.");
    } catch (err) {
      flash(err.response?.data?.error || "Revoke failed.");
    }
  };

  const getDisplayName = (user) => {
    const name = user?.name?.trim();
    if (name) return name;
    if (user?.full_name?.trim()) return user.full_name.trim();
    if (user?.username?.trim()) return user.username.trim();
    if (user?.email) return user.email.split("@")[0];
    return "—";
  };

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
        subject_id: null,
        subject: np.subject,
        grade: np.grade,
        year: parseInt(np.year),
        paper: np.paper,
        title,
        file_url: np.url,
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

        {dbOnline === null && (
          <div className="admin-offline-banner" style={{ background: "#e8f0fe", borderColor: "#1a73e8" }}>
            <span>⏳</span>
            <div>
              <strong>Connecting to backend…</strong>
              <p>Waking up the server (free tier). This may take up to 30 seconds.</p>
            </div>
          </div>
        )}

        {dbOnline === false && (
          <div className="admin-offline-banner">
            <span>⚠️</span>
            <div>
              <strong>Backend not ready</strong>
              <p>{dbError || "The server may still be waking up. Please wait a moment, then retry."}</p>
              {token && !token.startsWith("eyJ") && (
                <p style={{ marginTop: 6 }}>
                  <a
                    href="/login"
                    style={{ color: "#1a73e8", fontWeight: 600, textDecoration: "underline" }}
                    onClick={(e) => { e.preventDefault(); navigate("/login"); }}
                  >
                    → Sign in again with your online admin account
                  </a>
                </p>
              )}
            </div>
            <button
              className="primary-button"
              style={{ flexShrink: 0 }}
              onClick={() => {
                // If local token, redirect to login for a real JWT
                if (token && !token.startsWith("eyJ")) {
                  navigate("/login");
                } else {
                  loadAll();
                }
              }}
            >
              {token && !token.startsWith("eyJ") ? "Sign In" : "Retry"}
            </button>
          </div>
        )}

        {dbOnline === true && (
          <div className="admin-online-banner">
            <span>🟢</span>
            <strong>MongoDB Connected — South Sudan E-Learning</strong>
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
                  { label: "Manage Users",   icon: "👥", tab: "users"          },
                  { label: "Subscriptions",  icon: "💳", tab: "subscriptions"   },
                  { label: "Add Subject",    icon: "+", tab: "subjects"        },
                  { label: "Add Past Paper", icon: "📄", tab: "papers"          },
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
                      <td><strong>{getDisplayName(u)}</strong></td>
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
            PAYMENTS
        ════════════════════════════════════════════════════════════ */}
        {tab === "payments" && (
          <div className="admin-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h1>🧾 Payments & Requests</h1>
              <button className="primary-button" onClick={() => loadAll()}>Refresh</button>
            </div>
            <p style={{ color:"var(--muted)", marginBottom:20 }}>
              View pending and completed payment requests. Screenshots are sent to your admin email ({process.env.GMAIL_USER || "thiyangkoang77@gmail.com"}).
            </p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>User / Email</th>
                    <th>Amount</th>
                    <th>Provider</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsList.map((p) => (
                    <tr key={p.id}>
                      <td><span style={{ fontFamily: "monospace", color: "var(--muted)" }}>{p.tx_ref || "-"}</span></td>
                      <td>
                        <strong>{p.user_name || p.email}</strong><br />
                        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{p.email}</span>
                      </td>
                      <td><strong>{p.currency} {p.amount}</strong></td>
                      <td>{p.provider}</td>
                      <td>
                        <span className={`admin-tag ${p.status === "pending" ? "pending" : "active"}`}>
                          {p.status || "pending"}
                        </span>
                      </td>
                      <td>{p.created_at ? new Date(p.created_at).toLocaleString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paymentsList.length === 0 && (
                <p className="admin-empty">No payment requests yet.</p>
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            SUBSCRIPTIONS
        ════════════════════════════════════════════════════════════ */}
        {tab === "subscriptions" && (
          <div className="admin-section">
            <h1>💳 Subscription Management</h1>
            <p style={{ color:"var(--muted)", marginBottom:20 }}>
              After a student pays, enter their email here to activate their subscription.
            </p>

            {/* Activate form */}
            <div className="admin-form-card" style={{ marginBottom:28 }}>
              <h2>✅ Activate Subscription</h2>
              <form className="admin-form-grid" onSubmit={activateSub}>
                <div className="admin-field">
                  <label>Student Email</label>
                  <input className="admin-input" type="email" placeholder="student@gmail.com"
                    value={subEmail} onChange={e => setSubEmail(e.target.value)} required />
                </div>
                <div className="admin-field">
                  <label>Plan</label>
                  <select className="admin-select admin-select-lg" value={subPlan}
                    onChange={e => setSubPlan(e.target.value)}>
                    <option value="2-month">2 Months</option>
                    <option value="1-month">1 Month</option>
                    <option value="3-month">3 Months</option>
                    <option value="6-month">6 Months</option>
                    <option value="1-year">1 Year</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Duration (days)</label>
                  <input className="admin-input" type="number" min="1" max="365"
                    value={subDays} onChange={e => setSubDays(e.target.value)} />
                </div>
                <div className="admin-form-actions">
                  <button type="submit" className="primary-button">Activate Subscription</button>
                </div>
              </form>
              {subMsg && (
                <div style={{ marginTop:12, padding:"10px 14px", borderRadius:10,
                  background: subMsg.startsWith("✅") ? "#e8f5e9" : "#fff2f2",
                  color: subMsg.startsWith("✅") ? "#2e7d32" : "#8d1b1b",
                  border: `1px solid ${subMsg.startsWith("✅") ? "#a5d6a7" : "rgba(141,27,27,0.2)"}` }}>
                  {subMsg}
                </div>
              )}
            </div>

            {/* Subscribed users table */}
            <h2 style={{ marginBottom:12 }}>All Users &amp; Subscription Status</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map((u, i) => (
                    <tr key={u.id}>
                      <td>{i + 1}</td>
                      <td><strong>{u.name || "—"}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.subscription_plan || "—"}</td>
                      <td>{u.subscription_expiry ? new Date(u.subscription_expiry).toLocaleDateString() : "—"}</td>
                      <td>
                        <span style={{
                          padding:"3px 10px", borderRadius:20, fontSize:"0.78rem", fontWeight:700,
                          background: u.is_subscribed ? "#e8f5e9" : "#f5f5f5",
                          color: u.is_subscribed ? "#2e7d32" : "#777",
                          border: `1px solid ${u.is_subscribed ? "#a5d6a7" : "#ddd"}`,
                        }}>
                          {u.is_subscribed ? "✅ Active" : "⬜ Inactive"}
                        </span>
                      </td>
                      <td>
                        {u.is_subscribed ? (
                          <button className="admin-del-btn" onClick={() => revokeSub(u.id, u.email)} title="Revoke">
                            ✕
                          </button>
                        ) : (
                          <button className="ghost-button" style={{ padding:"4px 10px", fontSize:"0.78rem" }}
                            onClick={() => { setSubEmail(u.email); setTab("subscriptions"); }}>
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subs.length === 0 && (
                <p className="admin-empty">No users yet — they'll appear here after registering.</p>
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
                <p>MongoDB · <strong>South Sudan E-Learning</strong></p>
                <p>Host: MongoDB Atlas or local MongoDB</p>
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
                <p>Promote your current account to admin on the server.</p>
                <button
                  className="primary-button"
                  onClick={async () => {
                    const raw = localStorage.getItem("sslauth");
                    if (!raw) { alert("Not logged in."); return; }
                    const s = JSON.parse(raw);
                    const email = s?.user?.email;
                    if (!email) { alert("No email found."); return; }
                    try {
                      // Try server first
                      const res = await api.post("/auth/promote-admin", {
                        secret: "ss_setup_2024_hisky", email
                      });
                      // Update local session role
                      s.user.role = "admin";
                      localStorage.setItem("sslauth", JSON.stringify(s));
                      alert(`✅ ${res.data.message}\nRefreshing...`);
                      window.location.reload();
                    } catch (err) {
                      // Fallback: update locally only
                      s.user.role = "admin";
                      localStorage.setItem("sslauth", JSON.stringify(s));
                      alert("Updated locally. Refresh the page.");
                      window.location.reload();
                    }
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
                  Senior 1–4 · 15+ subjects
                </p>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
