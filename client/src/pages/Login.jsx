import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/streams/1";
  const { saveSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please enter your email and password."); return; }
    try {
      setLoading(true);
      const data = await login(form.email, form.password);
      saveSession({ token: data.token, user: data.user });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    alert("Google login coming soon. Please use email and password for now.");
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <img src="https://flagcdn.com/w80/ss.png" alt="South Sudan" style={{ width: 56, borderRadius: 8 }} />
        <div>
          <strong>South Sudan E-Learning</strong>
          <small>Secondary School Platform</small>
        </div>
      </div>

      <span className="eyebrow">Student access</span>
      <h1>Welcome back 👋</h1>
      <p>Login to access your subjects, notes, quizzes, and AI tutor.</p>

      <form className="auth-form" onSubmit={handleSubmit}>

        {/* Email */}
        <label>
          Email address
          <div className="auth-input-wrap">
            <span className="auth-input-icon">✉️</span>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@gmail.com" required autoFocus />
          </div>
          <small className="auth-hint">Use a real email address for account recovery.</small>
        </label>

        {/* Password */}
        <label>
          <div className="auth-label-row">
            <span>Password</span>
            <button type="button" className="auth-forgot" onClick={() => alert("Password reset: contact your teacher or admin.")}>
              Forgot password?
            </button>
          </div>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">🔒</span>
            <input name="password" type={showPassword ? "text" : "password"} value={form.password}
              onChange={handleChange} placeholder="Enter your password" required />
            <button type="button" className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        {error && <div className="message-card error">{error}</div>}

        {/* Google button */}
        <button type="button" className="auth-google-btn" onClick={handleGoogle}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Remember me */}
        <label className="auth-remember">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          <span>Remember me</span>
        </label>

        <button type="submit" className="primary-button auth-submit-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="auth-switch">
        New student? <Link to="/register">Create a free account</Link>
      </p>
    </div>
  );
}
