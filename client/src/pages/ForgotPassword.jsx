import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const LOCAL_KEY = "ss_users";
const getLocalUsers = () => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; } };
const saveLocalUsers = (u) => localStorage.setItem(LOCAL_KEY, JSON.stringify(u));

// Generate a 6-digit code
const genCode = () => String(Math.floor(100000 + Math.random() * 900000));

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);       // 1=email, 2=code, 3=new password, 4=done
  const [email, setEmail] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeExpiry, setCodeExpiry] = useState(null);

  // ── Step 1: Send verification code ───────────────────────
  const handleSendCode = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Please enter a valid email address."); return;
    }

    const code = genCode();
    setSentCode(code);
    setCodeExpiry(Date.now() + 10 * 60 * 1000); // 10 minutes
    setStep(2);
  };

  // ── Step 2: Verify code ───────────────────────────────────
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError("");

    if (Date.now() > codeExpiry) {
      setError("Code has expired. Please request a new one.");
      setStep(1); setSentCode(""); setEnteredCode("");
      return;
    }

    if (enteredCode.trim() !== sentCode) {
      setError("Incorrect code. Please check and try again.");
      return;
    }

    setStep(3);
  };

  // ── Step 3: Set new password ──────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);

    // Try backend
    try {
      await api.post("/auth/reset-password", { email: email.toLowerCase(), newPassword });
    } catch { /* offline — continue to local */ }

    // Always update localStorage
    const users = getLocalUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      users[idx].password = newPassword;
      saveLocalUsers(users);
    } else {
      saveLocalUsers([...users, {
        id: Date.now(), name: email.split("@")[0],
        email: email.toLowerCase(), password: newPassword, role: "student"
      }]);
    }

    setLoading(false);
    setStep(4);
  };

  const resendCode = () => {
    const code = genCode();
    setSentCode(code);
    setCodeExpiry(Date.now() + 10 * 60 * 1000);
    setEnteredCode("");
    setError("");
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <img src="https://flagcdn.com/w80/ss.png" alt="South Sudan"
          style={{ width: 56, borderRadius: 8 }}
          onError={e => { e.target.onerror=null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/6d/Flag_of_South_Sudan.svg/56px-Flag_of_South_Sudan.svg.png"; }} />
        <div>
          <strong>South Sudan E-Learning</strong>
          <small>Password Recovery</small>
        </div>
      </div>

      {/* Progress steps */}
      <div className="fp-steps">
        {["Email","Code","Password","Done"].map((s, i) => (
          <div key={s} className={`fp-step ${step > i+1 ? "done" : step === i+1 ? "active" : ""}`}>
            <div className="fp-step-dot">{step > i+1 ? "✓" : i+1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* ── STEP 1: Email ── */}
      {step === 1 && (
        <>
          <span className="eyebrow">Step 1 of 3</span>
          <h1>Forgot Password? 🔑</h1>
          <p>Enter your registered email. We'll send you a 6-digit verification code.</p>
          <form className="auth-form" onSubmit={handleSendCode}>
            <label>
              Email address
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉️</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@gmail.com" required autoFocus />
              </div>
            </label>
            {error && <div className="message-card error">{error}</div>}
            <button type="submit" className="primary-button auth-submit-btn">
              Send Verification Code →
            </button>
          </form>
          <p className="auth-switch">Remember your password? <Link to="/login">Login here</Link></p>
        </>
      )}

      {/* ── STEP 2: Verification code ── */}
      {step === 2 && (
        <>
          <span className="eyebrow">Step 2 of 3</span>
          <h1>Enter Verification Code 📱</h1>
          <p>A 6-digit code has been generated for <strong>{email}</strong></p>

          {/* Show the code (since we can't send email) */}
          <div className="fp-code-display">
            <div className="fp-code-label">Your verification code:</div>
            <div className="fp-code-value">{sentCode}</div>
            <div className="fp-code-note">
              ⏱️ Valid for 10 minutes · Copy this code and enter it below
            </div>
          </div>

          <form className="auth-form" onSubmit={handleVerifyCode}>
            <label>
              Enter the 6-digit code
              <input
                type="text"
                value={enteredCode}
                onChange={e => setEnteredCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="fp-code-input"
                required autoFocus
              />
            </label>
            {error && <div className="message-card error">{error}</div>}
            <button type="submit" className="primary-button auth-submit-btn"
              disabled={enteredCode.length !== 6}>
              Verify Code →
            </button>
            <button type="button" className="ghost-button" style={{ width:"100%" }} onClick={resendCode}>
              🔄 Generate New Code
            </button>
            <button type="button" className="ghost-button" style={{ width:"100%" }}
              onClick={() => { setStep(1); setError(""); }}>
              ← Back
            </button>
          </form>
        </>
      )}

      {/* ── STEP 3: New password ── */}
      {step === 3 && (
        <>
          <span className="eyebrow">Step 3 of 3</span>
          <h1>Set New Password 🔒</h1>
          <p>Create a new password for <strong>{email}</strong></p>
          <form className="auth-form" onSubmit={handleReset}>
            <label>
              New Password
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input type={showPw ? "text" : "password"} value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters" required autoFocus />
                <button type="button" className="auth-eye" onClick={() => setShowPw(!showPw)}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </label>
            <label>
              Confirm New Password
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input type={showPw ? "text" : "password"} value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat new password" required />
              </div>
              {confirm && newPassword !== confirm && (
                <span className="auth-email-warning">❌ Passwords do not match</span>
              )}
              {confirm && newPassword === confirm && confirm.length > 0 && (
                <span style={{ color:"#2e7d32", fontSize:"0.78rem", fontWeight:700 }}>✅ Passwords match</span>
              )}
            </label>
            {error && <div className="message-card error">{error}</div>}
            <button type="submit" className="primary-button auth-submit-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password →"}
            </button>
          </form>
        </>
      )}

      {/* ── STEP 4: Done ── */}
      {step === 4 && (
        <div style={{ textAlign:"center", display:"grid", gap:16, padding:"16px 0" }}>
          <span style={{ fontSize:"4rem" }}>✅</span>
          <h1>Password Reset!</h1>
          <p>Your password for <strong>{email}</strong> has been updated successfully.</p>
          <button className="primary-button auth-submit-btn" onClick={() => navigate("/login")}>
            Go to Login →
          </button>
        </div>
      )}
    </div>
  );
}
