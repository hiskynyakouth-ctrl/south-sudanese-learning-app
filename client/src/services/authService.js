import axios from 'axios';
import { getApiBaseURL } from './apiBase';

const LOCAL_USERS_KEY = "ss_users";
const API = getApiBaseURL();

const authApi = axios.create({ baseURL: API, timeout: 10000 }); // 10 seconds

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
  try {
    const res = await authApi.post('/auth/login', { email: email.trim(), password });
    return res.data;
  } catch (err) {
    // Only 401 (wrong password) should block — everything else falls through to localStorage
    if (err.response?.status === 401) throw err;
    // 404, 500, 503, no response — fall through to localStorage
  }

  // localStorage fallback
  const users = getLocalUsers();
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) throw makeError("No account found with this email. Please register first.");
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
