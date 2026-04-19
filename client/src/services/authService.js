import axios from 'axios';

const LOCAL_USERS_KEY = "ss_users";
const API = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// Short timeout so offline fallback kicks in quickly
const authApi = axios.create({ baseURL: API, timeout: 3000 });

const getLocalUsers = () => {
  try { return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]"); }
  catch { return []; }
};
const saveLocalUsers = (users) =>
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
const makeToken = (user) => `local_${user.id}_${Date.now()}`;

// ── Login ────────────────────────────────────────────────
export const login = async (email, password) => {
  try {
    const res = await authApi.post('/auth/login', { email, password });
    return res.data;
  } catch (err) {
    // Backend offline or timed out — use localStorage
    if (!err.response) {
      const users = getLocalUsers();
      const user = users.find((u) => u.email === email);
      if (!user) {
        const e = new Error("No account found with this email.");
        e.response = { data: { error: "No account found with this email." } };
        throw e;
      }
      if (user.password !== password) {
        const e = new Error("Incorrect password.");
        e.response = { data: { error: "Incorrect password. Please try again." } };
        throw e;
      }
      const safeUser = { id: user.id, name: user.name, email: user.email };
      return { token: makeToken(safeUser), user: safeUser };
    }
    throw err;
  }
};

// ── Register ─────────────────────────────────────────────
export const register = async (name, email, password) => {
  try {
    const res = await authApi.post('/auth/register', { name, email, password });
    return res.data;
  } catch (err) {
    // Backend offline or timed out — save to localStorage
    if (!err.response) {
      const users = getLocalUsers();
      if (users.find((u) => u.email === email)) {
        const e = new Error("Account already exists.");
        e.response = { data: { error: "An account with this email already exists." } };
        throw e;
      }
      const user = { id: Date.now(), name, email, password };
      saveLocalUsers([...users, user]);
      const safeUser = { id: user.id, name, email };
      return { token: makeToken(safeUser), user: safeUser };
    }
    throw err;
  }
};
