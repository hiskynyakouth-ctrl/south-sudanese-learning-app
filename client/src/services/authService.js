import axios from 'axios';
import { getApiBaseURL, wakeBackend } from './apiBase';

const LOCAL_USERS_KEY = "ss_users";
const API = getApiBaseURL();

// 60 seconds — enough for Render free tier to cold-start
const authApi = axios.create({ baseURL: API, timeout: 60000 });

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
export const login = async (email, password, onWaking) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Always try the backend first — for ALL users.
  // Show waking indicator if server might be cold-starting.
  if (typeof onWaking === "function") onWaking(true);

  try {
    const res = await authApi.post('/auth/login', { email: normalizedEmail, password });
    if (typeof onWaking === "function") onWaking(false);
    return res.data;
  } catch (err) {
    if (typeof onWaking === "function") onWaking(false);

    // Wrong password — never fall back
    if (err.response?.status === 401) throw err;

    // Server conflict / validation error — don't fall back
    if (err.response?.status === 400 || err.response?.status === 409) throw err;

    // Server busy / cold-starting — wake it up and retry once
    if (err.code === "ECONNABORTED" || !err.response) {
      if (typeof onWaking === "function") onWaking(true);
      const awake = await wakeBackend(90000);
      if (typeof onWaking === "function") onWaking(false);
      if (awake) {
        try {
          const retryRes = await authApi.post('/auth/login', { email: normalizedEmail, password });
          return retryRes.data;
        } catch (retryErr) {
          if (retryErr.response?.status === 401) throw retryErr;
          throw makeError("Backend woke up but login failed. Please check your credentials.");
        }
      }
      throw makeError("The server is taking too long to start. Please wait 30 seconds and try again.");
    }

    // Server returned 5xx or other error
    if (err.response?.status >= 500) {
      throw makeError(err.response?.data?.error || "Server error. Please try again in a moment.");
    }
  }

  // Only fall back to localStorage for non-server errors (e.g. no internet at all)
  const users = getLocalUsers();
  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) throw makeError("No account found. Please register first or check your internet connection.");
  if (user.loginMethod === "google" || user.password?.startsWith("google_")) {
    throw makeError("This account uses Google login. Please click 'Continue with Google'.");
  }
  if (user.password !== password) throw makeError("Incorrect password. Please try again.");
  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role || "student" };
  return { token: makeToken(safeUser), user: safeUser };
};

// ── Register ─────────────────────────────────────────────
export const register = async (name, email, password, phone = "") => {
  try {
    const res = await authApi.post('/auth/register', { name, email: email.trim(), password, phone });
    // Also cache in localStorage for offline fallback
    const users = getLocalUsers();
    if (!users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      saveLocalUsers([...users, { id: res.data.user.id, name, email: email.trim(), password, phone, role: "student" }]);
    }
    return res.data;
  } catch (err) {
    if (err.response?.status === 409) throw err;
    if (err.response) throw err;
    // Server offline — register locally
  }

  const users = getLocalUsers();
  if (users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw makeError("An account with this email already exists. Please login.");
  }
  const user = { id: Date.now(), name, email: email.trim(), phone, password, role: "student" };
  saveLocalUsers([...users, user]);
  const safeUser = { id: user.id, name, email: email.trim(), phone, role: "student" };
  return { token: makeToken(safeUser), user: safeUser };
};

// ── Google register / login ───────────────────────────────
export const googleRegister = async (name, email, password, googleId, picture) => {
  // 1. Try backend
  try {
    const res = await authApi.post('/auth/google', { name, email, password, googleId, picture });
    // Also save to localStorage as backup
    const users = getLocalUsers();
    if (!users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      saveLocalUsers([...users, { id: res.data.user.id, name, email, password, role: "student", googleId, loginMethod: "google", picture }]);
    }
    return res.data;
  } catch (err) {
    if (err.response?.status === 409) throw err;
    if (err.response && err.response.status >= 500) throw err;
    // Backend offline — fall through to localStorage
  }

  // 2. Local storage fallback
  const users = getLocalUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    const safeUser = { id: existing.id, name: existing.name, email: existing.email, role: existing.role || "student" };
    return { token: makeToken(safeUser), user: safeUser };
  }
  const user = { id: Date.now(), name, email, password, role: "student", googleId, loginMethod: "google", picture };
  saveLocalUsers([...users, user]);
  const safeUser = { id: user.id, name, email, role: "student" };
  return { token: makeToken(safeUser), user: safeUser };
};
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
