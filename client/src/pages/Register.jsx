import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Mock local registration used when the server is unreachable
const MOCK_USERS_KEY = "ssl_mock_users";

function getMockUsers() {
  try { return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]"); }
  catch { return []; }
}

export default function Register() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    try {
      const users = getMockUsers();
      if (users.find((u) => u.email === form.email)) {
        setError("An account with that email already exists.");
        return;
      }
      const user = { id: Date.now(), name: form.name, email: form.email };
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...users, { ...user, password: form.password }]));
      saveSession({ token: `local-token-${user.id}`, user });
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to create your account.");
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
        <button type="submit" className="primary-button">
          Register
        </button>
      </form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
