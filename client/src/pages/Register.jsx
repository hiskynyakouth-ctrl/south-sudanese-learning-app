import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((c) => ({ ...c, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    try {
      setLoading(true);
      const data = await register(form.name, form.email, form.password);
      saveSession({ token: data.token, user: data.user });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
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
      <span className="eyebrow">Create account</span>
      <h1>Join the platform 🎓</h1>
      <p>Register to save your progress, take quizzes, and use the AI tutor.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input name="name" type="text" value={form.name} onChange={handleChange}
            placeholder="Your full name" required autoFocus />
        </label>
        <label>
          Email address
          <input name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="your@email.com" required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange}
            placeholder="At least 6 characters" required />
        </label>
        <label>
          Confirm password
          <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
            placeholder="Repeat your password" required />
        </label>
        {error && <div className="message-card error">{error}</div>}
        <button type="submit" className="primary-button" disabled={loading} style={{ padding: "14px" }}>
          {loading ? "Creating account..." : "Create Account →"}
        </button>
      </form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
