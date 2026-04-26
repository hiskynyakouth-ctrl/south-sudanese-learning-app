import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { genCode, sendEmailCode, sendSMSCode } from "../services/sendCode";

const LOCAL_KEY = "ss_users";
const getLocalUsers = () => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); } catch { return []; } };
const saveLocalUsers = (u) => localStorage.setItem(LOCAL_KEY, JSON.stringify(u));

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("email");
  const [contact, setContact] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [delivered, setDelivered] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeExpiry, setCodeExpiry] = useState(null);

  // Step 1 — Send code
  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    if (!contact.trim()) { setError(`Please enter your ${method === "email" ? "email address" : "phone number"}.`); return; }
    setLoading(true);

    const code = genCode();
    let result = { ok: false };

    if (method === "email") {
      result = await sendEmailCode(contact, code);
    } else {
      result = await sendSMSCode(contact, code);
    }

    if (result.ok) {
      setSentCode(code);
      setDelivered(true);
      setDeliveryMethod(result.method);
      setCodeExpiry(Date.now() + 10 * 60 * 1000);
      setLoading(false);
      setStep(2);
    } else {
      setLoading(false);
      setError(
        result.error ||
        (method === "email"
          ? "Could not send email. Make sure the backend server is running and Gmail is configured in server/.env"
          : "Could not send SMS. Make sure the backend server is running and Twilio/TextBelt is configured.")
      );
    }
  };

  // Step 2 — Verify code
  const handleVerify = (e) => {
    e.preventDefault();
    setError("");
    if (Date.now() > codeExpiry) {
      setError("Code has expired. Please request a new one.");
      setStep(1); return;
    }
    if (enteredCode.trim() !== sentCode) {
      setError("Incorrect code. Please check and try again."); return;
    }
    setStep(3);
  };

  // Step 3 — Reset password
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);

    const emailToReset = method === "email" ? contact : (() => {
      const u = getLocalUsers().find(u => u.phone === contact);
      return u?.email || contact;
    })();

    try { await api.post("/auth/reset-password", { email: emailToReset.toLowerCase(), newPassword }); } catch {}

    const users = getLocalUsers();
    const idx = users.findIndex(u =>
      method === "email"
        ? u.email.toLowerCase() === contact.toLowerCase()
        : u.phone === contact
    );
    if (idx !== -1) { users[idx].password = newPassword; saveLocalUsers(users); }
    else { saveLocalUsers([...users, { id: Date.now(), name: contact.split("@")[0], email: emailToReset.toLowerCase(), password: newPassword, role: "student" }]); }

    setLoading(false);
    setStep(4);
  };

  const resend = async () => {
    setLoading(true);
    const code = genCode();
    const result = method === "email"
      ? await sendEmailCode(contact, code)
      : await sendSMSCode(contact, code);

    if (result.ok) {
      setSentCode(code); setDelivered(true);
      setCodeExpiry(Date.now() + 10 * 60 * 1000);
      setEnteredCode(""); setError("");
    } else {
      setError("Failed to resend. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <img src="https://flagcdn.com/w80/ss.png" alt="South Sudan" style={{ width: 56, borderRadius: 8 }}
          onError={e => { e.target.onerror=null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/6d/Flag_of_South_Sudan.svg/56px-Flag_of_South_Sudan.svg.png"; }} />
        <div><strong>South Sudan E-Learning</strong><small>Password Recovery</small></div>
      </div>

      {/* Progress */}
      <div className="fp-steps">
        {["Contact","Code","Password","Done"].map((s, i) => (
          <div key={s} className={`fp-step ${step > i+1 ? "done" : step === i+1 ? "active" : ""}`}>
            <div className="fp-step-dot">{step > i+1 ? "✓" : i+1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      {/* ── Step 1: Choose method & enter contact ── */}
      {step === 1 && (
        <>
          <span className="eyebrow">Step 1 of 3</span>
          <h1>Forgot Password? 🔑</h1>
          <p>Choose how you want to receive your verification code.</p>

          <div className="fp-method-row">
            <button type="button" className={`fp-method-btn${method === "email" ? " active" : ""}`}
              onClick={() => { setMethod("email"); setContact(""); setError(""); }}>
              <span>📧</span>
              <strong>Email</strong>
              <small>Code sent to your email</small>
            </button>
            <button type="button" className={`fp-method-btn${method === "sms" ? " active" : ""}`}
              onClick={() => { setMethod("sms"); setContact(""); setError(""); }}>
              <span>📱</span>
              <strong>SMS</strong>
              <small>Code sent to your phone</small>
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSend}>
            {method === "email" ? (
              <label>
                Email address
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input type="email" value={contact} onChange={e => setContact(e.target.value)}
                    placeholder="your@gmail.com" required autoFocus />
                </div>
              </label>
            ) : (
              <label>
                Phone number
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">📱</span>
                  <input type="tel" value={contact} onChange={e => setContact(e.target.value)}
                    placeholder="+211 912 345 678" required autoFocus />
                </div>
                <small className="auth-hint">Include country code (e.g. +211 for South Sudan)</small>
              </label>
            )}
            {error && <div className="message-card error">{error}</div>}
            <button type="submit" className="primary-button auth-submit-btn" disabled={loading}>
              {loading ? "Sending code..." : `Send Code via ${method === "email" ? "Email" : "SMS"} →`}
            </button>
          </form>
          <p className="auth-switch">Remember your password? <Link to="/login">Login here</Link></p>
        </>
      )}

      {/* ── Step 2: Enter code ── */}
      {step === 2 && (
        <>
          <span className="eyebrow">Step 2 of 3</span>
          <h1>Enter Verification Code</h1>

          <div className="fp-email-sent">
            <span>{method === "email" ? "📧" : "📱"}</span>
            <div>
              <strong>Code sent to {contact}</strong>
              <p>
                Check your {method === "email" ? "inbox (and spam folder)" : "SMS messages"}.
                Enter the 6-digit code below. Valid for 10 minutes.
              </p>
              {deliveryMethod && (
                <small style={{ color:"var(--primary)", fontWeight:600 }}>
                  ✓ Delivered via {deliveryMethod}
                </small>
              )}
            </div>
          </div>

          <form className="auth-form" onSubmit={handleVerify}>
            <label>
              6-digit verification code
              <input type="text" value={enteredCode}
                onChange={e => setEnteredCode(e.target.value.replace(/\D/g,"").slice(0,6))}
                placeholder="000000" maxLength={6} className="fp-code-input" required autoFocus />
            </label>
            {error && <div className="message-card error">{error}</div>}
            <button type="submit" className="primary-button auth-submit-btn" disabled={enteredCode.length !== 6}>
              Verify Code →
            </button>
            <button type="button" className="ghost-button" style={{ width:"100%" }}
              onClick={resend} disabled={loading}>
              {loading ? "Sending..." : "🔄 Resend Code"}
            </button>
            <button type="button" className="ghost-button" style={{ width:"100%" }}
              onClick={() => { setStep(1); setError(""); }}>← Back</button>
          </form>
        </>
      )}

      {/* ── Step 3: New password ── */}
      {step === 3 && (
        <>
          <span className="eyebrow">Step 3 of 3</span>
          <h1>Set New Password 🔒</h1>
          <p>Create a new password for <strong>{contact}</strong></p>
          <form className="auth-form" onSubmit={handleReset}>
            <label>
              New Password
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input type={showPw ? "text" : "password"} value={newPassword}
                  onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters" required autoFocus />
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
                  onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" required />
              </div>
              {confirm && newPassword !== confirm && <span className="auth-email-warning">❌ Passwords do not match</span>}
              {confirm && newPassword === confirm && confirm.length > 0 && <span style={{ color:"#2e7d32", fontSize:"0.78rem", fontWeight:700 }}>✅ Passwords match</span>}
            </label>
            {error && <div className="message-card error">{error}</div>}
            <button type="submit" className="primary-button auth-submit-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password →"}
            </button>
          </form>
        </>
      )}

      {/* ── Step 4: Done ── */}
      {step === 4 && (
        <div style={{ textAlign:"center", display:"grid", gap:16, padding:"16px 0" }}>
          <span style={{ fontSize:"4rem" }}>✅</span>
          <h1>Password Reset!</h1>
          <p>Your password has been updated successfully.</p>
          <button className="primary-button auth-submit-btn" onClick={() => navigate("/login")}>
            Go to Login →
          </button>
        </div>
      )}
    </div>
  );
}
