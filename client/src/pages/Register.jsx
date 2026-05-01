import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register, googleRegister } from "../services/authService";
import { signInWithGoogle } from "../services/googleAuth";
import { emailError, emailWarning } from "../utils/validateEmail";
import CountryCodePicker from "../components/CountryCodePicker";

// ── Password strength checker ─────────────────────────────
const checkStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "", tips: [] };
  const tips = [];
  let score = 0;
  if (pw.length >= 8)  score++; else tips.push("Use at least 8 characters");
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++; else tips.push("Add an uppercase letter (A-Z)");
  if (/[0-9]/.test(pw)) score++; else tips.push("Add a number (0-9)");
  if (/[^A-Za-z0-9]/.test(pw)) score++; else tips.push("Add a special character (!@#$%)");
  if (/(.)\1{2,}/.test(pw)) { score--; tips.push("Avoid repeating characters (aaa, 111)"); }
  const levels = [
    { label: "Too weak",    color: "#ef5350" },
    { label: "Weak",        color: "#ff7043" },
    { label: "Fair",        color: "#ffa726" },
    { label: "Good",        color: "#66bb6a" },
    { label: "Strong",      color: "#26a69a" },
    { label: "Very strong", color: "#1565c0" },
  ];
  const s = Math.max(0, Math.min(score, 5));
  return { score: s, ...levels[s], tips };
};

const generatePassword = () => {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const nums  = "23456789";
  const syms  = "!@#$%&*";
  const all   = upper + lower + nums + syms;
  let pw = upper[Math.floor(Math.random()*upper.length)]
         + lower[Math.floor(Math.random()*lower.length)]
         + nums[Math.floor(Math.random()*nums.length)]
         + syms[Math.floor(Math.random()*syms.length)];
  for (let i = 0; i < 8; i++) pw += all[Math.floor(Math.random()*all.length)];
  return pw.split("").sort(() => Math.random()-0.5).join("");
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();

  // Email/phone form state
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Google set-password step
  const [googleProfile, setGoogleProfile] = useState(null); // holds Google profile while waiting for password
  const [googlePw, setGooglePw] = useState("");
  const [googlePwConfirm, setGooglePwConfirm] = useState("");
  const [showGooglePw, setShowGooglePw] = useState(false);

  const strength = checkStrength(form.password);
  const googleStrength = checkStrength(googlePw);
  const handleChange = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  const useSuggested = () => {
    const pw = generatePassword();
    setForm(f => ({ ...f, password: pw, confirm: pw }));
    setShowPw(true);
    navigator.clipboard?.writeText(pw).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const useSuggestedGoogle = () => {
    const pw = generatePassword();
    setGooglePw(pw); setGooglePwConfirm(pw); setShowGooglePw(true);
    navigator.clipboard?.writeText(pw).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // ── Email/phone register ──────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    const emailErr = emailError(form.email);
    if (emailErr) { setError(emailErr); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (strength.score < 2) { setError("Password is too weak. Use the suggestion below or make it stronger."); return; }
    try {
      setLoading(true);
      const fullPhone = form.phone ? (form.countryCode || "+211") + form.phone.replace(/^0/, "") : "";
      const data = await register(form.name, form.email, form.password, fullPhone);
      saveSession({ token: data.token, user: data.user });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  // ── Step 1: Google button clicked — get profile ───────
  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      const profile = await signInWithGoogle();
      const KEY = "ss_users";
      const users = JSON.parse(localStorage.getItem(KEY) || "[]");
      const existing = users.find(u => u.email === profile.email);

      if (existing) {
        // Returning Google user — log straight in
        const safeUser = { id: existing.id, name: existing.name, email: existing.email,
          role: existing.role || "student", picture: profile.picture, loginMethod: "google" };
        saveSession({ token: `local_${existing.id}_${Date.now()}`, user: safeUser });
        navigate("/");
      } else {
        // New user — password already collected in the popup, save to DB + localStorage
        if (profile.password) {
          const data = await googleRegister(profile.name, profile.email, profile.password, profile.googleId, profile.picture);
          saveSession({ token: data.token, user: { ...data.user, picture: profile.picture, loginMethod: "google" } });
          navigate("/");
        } else {
          // Real Google OAuth — ask for password on next step
          setGoogleProfile(profile);
        }
      }
    } catch (err) {
      setError(err.message || "Google sign-up failed.");
    } finally { setLoading(false); }
  };

  // ── Step 2: Save Google user with their chosen password ─
  const handleGoogleSetPassword = (e) => {
    e.preventDefault();
    setError("");
    if (googlePw.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (googlePw !== googlePwConfirm) { setError("Passwords do not match."); return; }
    if (googleStrength.score < 2) { setError("Password is too weak. Please make it stronger."); return; }

    const KEY = "ss_users";
    const users = JSON.parse(localStorage.getItem(KEY) || "[]");
    const newUser = {
      id: Date.now(),
      name: googleProfile.name,
      email: googleProfile.email,
      password: googlePw,           // real password they chose
      role: "student",
      googleId: googleProfile.googleId,
      loginMethod: "google",
      picture: googleProfile.picture,
    };
    localStorage.setItem(KEY, JSON.stringify([...users, newUser]));

    const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email,
      role: "student", picture: googleProfile.picture, loginMethod: "google" };
    saveSession({ token: `local_${newUser.id}_${Date.now()}`, user: safeUser });
    navigate("/");
  };

  // ══════════════════════════════════════════════════════
  // RENDER: Google set-password step
  // ══════════════════════════════════════════════════════
  if (googleProfile) {
    return (
      <div className="auth-card">
        <div className="auth-logo">
          <img src="https://flagcdn.com/w80/ss.png" alt="South Sudan" style={{ width: 56, borderRadius: 8 }} />
          <div>
            <strong>South Sudan E-Learning</strong>
            <small>One last step</small>
          </div>
        </div>

        {/* Google profile preview */}
        <div className="google-profile-banner">
          {googleProfile.picture
            ? <img src={googleProfile.picture} alt={googleProfile.name} className="google-profile-pic" />
            : <div className="google-profile-initial">{googleProfile.name[0]}</div>}
          <div>
            <strong>{googleProfile.name}</strong>
            <small>{googleProfile.email}</small>
          </div>
        </div>

        <h1>Set Your Password </h1>
        <p>
          Create a platform password for <strong>{googleProfile.email}</strong>.
          You'll use this to log in with email if Google is unavailable.
        </p>

        <form className="auth-form" onSubmit={handleGoogleSetPassword}>
          <label>
            Create a password
            <div className="auth-input-wrap">
              <span className="auth-input-icon"></span>
              <input type={showGooglePw ? "text" : "password"} value={googlePw}
                onChange={e => setGooglePw(e.target.value)}
                placeholder="At least 6 characters" required autoFocus />
              <button type="button" className="auth-eye" onClick={() => setShowGooglePw(v => !v)}>
                {showGooglePw ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Strength meter */}
            {googlePw && (
              <div className="pw-strength">
                <div className="pw-strength-bar">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className="pw-bar-seg"
                      style={{ background: i < googleStrength.score ? googleStrength.color : "var(--line)" }} />
                  ))}
                </div>
                <span className="pw-strength-label" style={{ color: googleStrength.color }}>
                  {googleStrength.label}
                </span>
              </div>
            )}
            {googlePw && googleStrength.tips.length > 0 && (
              <div className="pw-tips">
                {googleStrength.tips.map((t, i) => <div key={i} className="pw-tip">💡 {t}</div>)}
              </div>
            )}

          </label>

          <label>
            Confirm password
            <div className="auth-input-wrap">
              <span className="auth-input-icon"></span>
              <input type={showGooglePw ? "text" : "password"} value={googlePwConfirm}
                onChange={e => setGooglePwConfirm(e.target.value)}
                placeholder="Repeat your password" required />
            </div>
            {googlePwConfirm && googlePw !== googlePwConfirm && (
              <span className="auth-email-warning">❌ Passwords do not match</span>
            )}
            {googlePwConfirm && googlePw === googlePwConfirm && googlePwConfirm.length > 0 && (
              <span style={{ color:"#2e7d32", fontSize:"0.78rem", fontWeight:700 }}>✅ Passwords match</span>
            )}
          </label>

          {error && <div className="message-card error">{error}</div>}

          <button type="submit" className="primary-button auth-submit-btn">
            Complete Registration →
          </button>
          <button type="button" className="ghost-button"
            style={{ width:"100%", marginTop:4 }}
            onClick={() => { setGoogleProfile(null); setGooglePw(""); setGooglePwConfirm(""); setError(""); }}>
            ← Use a different account
          </button>
        </form>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // RENDER: Normal register form
  // ══════════════════════════════════════════════════════
  return (
    <div className="auth-card">
      <div className="auth-logo">
        <img src="https://flagcdn.com/w80/ss.png" alt="South Sudan" style={{ width: 56, borderRadius: 8 }} />
        <div>
          <strong>South Sudan E-Learning</strong>
          <small>Secondary School Platform</small>
        </div>
      </div>
      <span className="eyebrow">Create account</span>
      <h1>Join the platform 🎓</h1>
      <p>Register to save your progress and take quizzes.</p>

      <button type="button" className="auth-google-btn" onClick={handleGoogle} disabled={loading}>
        <GoogleIcon /> Continue with Google
      </button>

      <div className="auth-divider"><span>or register with email</span></div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input name="name" type="text" value={form.name} onChange={handleChange}
            placeholder="Your full name" required autoFocus />
        </label>

        <label>
          Email address
          <div className="auth-input-wrap">
            <span className="auth-input-icon">✉️</span>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="your@gmail.com" required />
          </div>
          {emailWarning(form.email) && <span className="auth-email-warning">⚠️ {emailWarning(form.email)}</span>}
        </label>

        <label>
          Phone Number (for SMS verification)
          <div className="phone-input-row">
            <CountryCodePicker
              value={form.countryCode || "+211"}
              onChange={v => setForm(f => ({ ...f, countryCode: v }))}
            />
            <input name="phone" type="tel" value={form.phone} onChange={handleChange}
              placeholder="912 345 678" className="phone-number-input" />
          </div>
          <small className="auth-hint">Used for SMS password reset only.</small>
        </label>

        <label>
          Password
          <div className="auth-input-wrap">
            <span className="auth-input-icon"></span>
            <input name="password" type={showPw ? "text" : "password"} value={form.password}
              onChange={handleChange} placeholder="Create a strong password" required />
            <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)}>
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
          {form.password && (
            <div className="pw-strength">
              <div className="pw-strength-bar">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="pw-bar-seg"
                    style={{ background: i < strength.score ? strength.color : "var(--line)" }} />
                ))}
              </div>
              <span className="pw-strength-label" style={{ color: strength.color }}>{strength.label}</span>
            </div>
          )}
          {form.password && strength.tips.length > 0 && (
            <div className="pw-tips">
              {strength.tips.map((t, i) => <div key={i} className="pw-tip">💡 {t}</div>)}
            </div>
          )}

        </label>

        <label>
          Confirm password
          <div className="auth-input-wrap">
            <span className="auth-input-icon"></span>
            <input name="confirm" type={showPw ? "text" : "password"} value={form.confirm}
              onChange={handleChange} placeholder="Repeat your password" required />
          </div>
          {form.confirm && form.password !== form.confirm && (
            <span className="auth-email-warning">❌ Passwords do not match</span>
          )}
          {form.confirm && form.password === form.confirm && form.confirm.length > 0 && (
            <span style={{ color:"#2e7d32", fontSize:"0.78rem", fontWeight:700 }}>✅ Passwords match</span>
          )}
        </label>

        {error && <div className="message-card error">{error}</div>}

        <button type="submit" className="primary-button auth-submit-btn" disabled={loading}>
          {loading ? "Creating account..." : "Create Account →"}
        </button>
      </form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
