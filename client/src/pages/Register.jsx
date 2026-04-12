import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const { data } = await api.post("/auth/register", form);
      saveSession({ token: data.token, user: data.user });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <span className="eyebrow">Create account</span>
      <h1>Join the learning platform</h1>
      <p>Register once to save your study session and use the AI tutor more effectively.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input name="name" type="text" value={form.name} onChange={handleChange} required />
        </label>
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
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
