import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", form);
      saveSession({ token: data.token, user: data.user });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to login with those details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <span className="eyebrow">Student access</span>
      <h1>Login to continue learning</h1>
      <p>Access saved study progress, chapter quizzes, and AI tutoring support.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        {error ? <div className="message-card error">{error}</div> : null}
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="auth-switch">
        New student? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
