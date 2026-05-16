import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import api from "../services/api";

// ── Avatar helpers ────────────────────────────────────────
const getAvatarKey = (user) => `ss_avatar_${user?.id || user?.email}`;
const getStoredAvatar = (user) => {
  try { return localStorage.getItem(getAvatarKey(user)) || null; } catch { return null; }
};
const saveAvatar = (user, dataUrl) => {
  try { localStorage.setItem(getAvatarKey(user), dataUrl); } catch {}
};

export default function Profile() {
  const { user, saveSession, token } = useAuth();
  const { getStats, getAllQuizResults } = useProgress();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(() => getStoredAvatar(user));
  const avatarRef = useRef();

  const stats = getStats();
  const results = getAllQuizResults().sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 10);
  const initial = (user?.name || "S")[0].toUpperCase();
  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

  const flash = (m, isErr = false) => {
    if (isErr) setError(m); else setMsg(m);
    setTimeout(() => { setMsg(""); setError(""); }, 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { flash("Image must be under 2MB.", true); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatar(dataUrl);
      saveAvatar(user, dataUrl);
      flash("Profile picture updated!");
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatar(null);
    try { localStorage.removeItem(getAvatarKey(user)); } catch {}
    flash("Profile picture removed.");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { flash("Name cannot be empty.", true); return; }
    setLoading(true);
    try {
      await api.put("/auth/profile", { name: form.name });
    } catch {
      // Server doesn't have route or offline — update locally only
    }
    // Always update locally
    saveSession({ token, user: { ...user, name: form.name } });
    setEditing(false);
    flash("Profile updated!");
    setLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPw.length < 6) { flash("New password must be at least 6 characters.", true); return; }
    if (pwForm.newPw !== pwForm.confirm) { flash("Passwords do not match.", true); return; }
    setLoading(true);
    try {
      await api.post("/auth/change-password", { currentPassword: pwForm.current, newPassword: pwForm.newPw });
      setPwForm({ current: "", newPw: "", confirm: "" });
      flash("Password changed successfully!");
    } catch (err) {
      flash(err.response?.data?.error || "Could not change password. Try using Forgot Password.", true);
    } finally { setLoading(false); }
  };

  return (
    <div className="profile-shell">

      {/* ── Header card ── */}
      <div className="profile-header-card">
        <div className="profile-avatar-wrap">
          {avatar
            ? <img src={avatar} alt="Profile" className="profile-avatar-img" />
            : <div className="profile-avatar-lg">{initial}</div>
          }
          <button className="profile-avatar-edit" onClick={() => avatarRef.current?.click()} title="Change photo">
            📷
          </button>
          <input ref={avatarRef} type="file" accept="image/*" style={{ display:"none" }}
            onChange={handleAvatarChange} />
        </div>
        <div className="profile-header-info">
          <h1>{user?.name}</h1>
          <span className={`profile-role-badge ${isAdmin ? "admin" : "student"}`}>
            {isAdmin ? "👑 Admin" : "🎓 Student"}
          </span>
          <p>{user?.email}</p>
          {avatar && (
            <button onClick={removeAvatar}
              style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"0.75rem", cursor:"pointer", padding:0, marginTop:4 }}>
              Remove photo
            </button>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="profile-stats-row">
        <div className="profile-stat-card">
          <div className="profile-stat-num">{stats.quizzesTaken}</div>
          <div className="profile-stat-label">Quizzes Taken</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-num" style={{ color: "#2e7d32" }}>{stats.quizzesPassed}</div>
          <div className="profile-stat-label">Quizzes Passed</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-num" style={{ color: "#1565c0" }}>{stats.avgScore}%</div>
          <div className="profile-stat-label">Average Score</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-num" style={{ color: "#e65100" }}>{stats.modulesRead}</div>
          <div className="profile-stat-label">Modules Read</div>
        </div>
      </div>

      <div className="profile-grid">

        {/* ── Edit profile ── */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h3>👤 Personal Info</h3>
            {!editing && (
              <button className="ghost-button" style={{ padding:"6px 14px", fontSize:"0.85rem" }}
                onClick={() => setEditing(true)}>Edit</button>
            )}
          </div>
          {msg && <div className="message-card" style={{ background:"#e8f5e9", color:"#2e7d32", border:"1px solid #a5d6a7", padding:"10px 14px", borderRadius:10, marginBottom:8 }}>{msg}</div>}
          {error && <div className="message-card error">{error}</div>}

          {editing ? (
            <form onSubmit={handleSave} style={{ display:"grid", gap:12 }}>
              <label style={{ display:"grid", gap:6, fontWeight:600 }}>
                Full Name
                <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  className="admin-input" placeholder="Your full name" required />
              </label>
              <label style={{ display:"grid", gap:6, fontWeight:600 }}>
                Email <small style={{ color:"var(--muted)", fontWeight:400 }}>(cannot change)</small>
                <input value={form.email} disabled className="admin-input" style={{ opacity:0.6 }} />
              </label>
              <div style={{ display:"flex", gap:10 }}>
                <button type="submit" className="primary-button" disabled={loading} style={{ padding:"10px 20px" }}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="ghost-button" onClick={() => setEditing(false)} style={{ padding:"10px 20px" }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display:"grid", gap:10 }}>
              <div className="profile-info-row"><span>Name</span><strong>{user?.name}</strong></div>
              <div className="profile-info-row"><span>Email</span><strong>{user?.email}</strong></div>
              <div className="profile-info-row"><span>Role</span><strong style={{ textTransform:"capitalize" }}>{user?.role || "student"}</strong></div>
            </div>
          )}
        </div>

        {/* ── Change password ── */}
        <div className="profile-card">
          <div className="profile-card-header"><h3>🔒 Change Password</h3></div>
          <form onSubmit={handlePasswordChange} style={{ display:"grid", gap:12 }}>
            <label style={{ display:"grid", gap:6, fontWeight:600 }}>
              Current Password
              <input type={showPw ? "text" : "password"} value={pwForm.current}
                onChange={e => setPwForm(f => ({...f, current: e.target.value}))}
                className="admin-input" placeholder="Current password" required />
            </label>
            <label style={{ display:"grid", gap:6, fontWeight:600 }}>
              New Password
              <input type={showPw ? "text" : "password"} value={pwForm.newPw}
                onChange={e => setPwForm(f => ({...f, newPw: e.target.value}))}
                className="admin-input" placeholder="At least 6 characters" required />
            </label>
            <label style={{ display:"grid", gap:6, fontWeight:600 }}>
              Confirm New Password
              <input type={showPw ? "text" : "password"} value={pwForm.confirm}
                onChange={e => setPwForm(f => ({...f, confirm: e.target.value}))}
                className="admin-input" placeholder="Repeat new password" required />
            </label>
            <label style={{ display:"flex", alignItems:"center", gap:8, fontWeight:600, cursor:"pointer" }}>
              <input type="checkbox" checked={showPw} onChange={e => setShowPw(e.target.checked)} />
              Show passwords
            </label>
            <button type="submit" className="primary-button" disabled={loading} style={{ padding:"10px 20px", justifySelf:"start" }}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
          <p style={{ marginTop:8, fontSize:"0.82rem", color:"var(--muted)" }}>
            Or use <button className="auth-forgot" onClick={() => navigate("/forgot-password")}>Forgot Password</button> to reset via email.
          </p>
        </div>

      </div>

      {/* ── Recent quiz results ── */}
      {results.length > 0 && (
        <div className="profile-card" style={{ marginTop:0 }}>
          <div className="profile-card-header"><h3>📝 Recent Quiz Results</h3></div>
          <div className="profile-results-list">
            {results.map((r, i) => (
              <div key={i} className={`profile-result-item ${r.passed ? "passed" : "failed"}`}>
                <div className="profile-result-info">
                  <strong>{r.moduleTitle}</strong>
                  <span>{r.subject} · Senior {r.classId}</span>
                </div>
                <div className="profile-result-score">
                  <span className="profile-result-pct" style={{ color: r.passed ? "#2e7d32" : "#c62828" }}>
                    {r.percent}%
                  </span>
                  <span className="profile-result-raw">{r.score}/{r.total}</span>
                  <span className={`profile-result-badge ${r.passed ? "pass" : "fail"}`}>
                    {r.passed ? "✅ Pass" : "❌ Fail"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="ghost-button" style={{ justifySelf:"start" }} onClick={() => navigate(-1)}>← Back</button>

    </div>
  );
}
