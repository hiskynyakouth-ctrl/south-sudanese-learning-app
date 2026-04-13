import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((c) => ({ ...c, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    // Frontend-only login — no backend needed
    const user = {
      name: form.email.split("@")[0],
      email: form.email,
    };
    saveSession({ token: "local-token", user });
    navigate("/");
  };

  return (
    <div className="auth-card">
      <span className="eyebrow">Student access</span>
      <h1>Login to continue learning</h1>
      <p>Access your subjects, chapter notes, quizzes, and AI tutoring.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <div className="message-card error">{error}</div>}
        <button type="submit" className="primary-button">
          Login
        </button>
      </form>

      <p className="auth-switch">
        New student? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
