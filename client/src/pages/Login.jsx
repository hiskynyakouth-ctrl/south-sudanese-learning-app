import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <label>
          Email address
          <input name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="your@email.com" required autoFocus />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange}
            placeholder="Enter your password" required />
        </label>
        {error && <div className="message-card error">{error}</div>}
        <button type="submit" className="primary-button" disabled={loading} style={{ padding: "14px" }}>
          {loading ? "Logging in..." : "Login →"}
        </button>
      </form>

      <p className="auth-switch">
        New student? <Link to="/register">Create a free account</Link>
      </p>
    </div>
  );
}
