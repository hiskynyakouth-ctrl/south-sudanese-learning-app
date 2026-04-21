import axios from 'axios';

const LOCAL_USERS_KEY = "ss_users";
const API = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const authApi = axios.create({ baseURL: API, timeout: 4000 });

const getLocalUsers = () => {
  try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]"); }
  catch { return []; }
};
const saveLocalUsers = (users) =>
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
const makeToken = (user) => `local_${user.id}_${Date.now()}`;

const makeError = (msg) => {
  const e = new Error(msg);
  e.response = { data: { error: msg } };
  return e;
};

// ── Login ────────────────────────────────────────────────
export const login = async (email, password) => {
  // 1. Try backend
  try {
    const res = await authApi.post('/auth/login', { email, password });
    return res.data;
  } catch (err) {
    // Backend returned 401 or 404 — try local storage
    // Backend offline (no response) — also try local storage
    // Only re-throw for server errors (500+)
    if (err.response && err.response.status >= 500) throw err;
    // Fall through to local for 401, 404, or no response
  }

  // 2. Local storage fallback
  const users = getLocalUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) throw makeError("No account found with this email. Please register first.");

  // Google users — they login via Google button, not password
  if (user.loginMethod === "google" || user.password?.startsWith("google_")) {
    throw makeError("This account uses Google login. Please click 'Continue with Google'.");
  }

  if (user.password !== password) throw makeError("Incorrect password. Please try again.");

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role || "student" };
  return { token: makeToken(safeUser), user: safeUser };
};

// ── Register ─────────────────────────────────────────────
export const register = async (name, email, password) => {
  // 1. Try backend
  try {
    const res = await authApi.post('/auth/register', { name, email, password });
    return res.data;
  } catch (err) {
    // 409 = already exists in DB — throw that error directly
    if (err.response?.status === 409) throw err;
    // 500+ = server error — throw
    if (err.response && err.response.status >= 500) throw err;
    // Offline or other — fall through to local
  }

  // 2. Local storage fallback
  const users = getLocalUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw makeError("An account with this email already exists. Please login.");
  }

  const user = { id: Date.now(), name, email, password, role: "student" };
  saveLocalUsers([...users, user]);
  const safeUser = { id: user.id, name, email, role: "student" };
  return { token: makeToken(safeUser), user: safeUser };
};

// ── Reset password ────────────────────────────────────────
export const resetPassword = (email, newPassword) => {
  const users = getLocalUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return false;
  users[idx].password = newPassword;
  saveLocalUsers(users);
  return true;
};

// ── Check if user exists locally ─────────────────────────
export const userExists = (email) => {
  const users = getLocalUsers();
  return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
};
