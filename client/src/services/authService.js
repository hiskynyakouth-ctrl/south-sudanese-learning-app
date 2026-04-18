import api from './api';

const LOCAL_USERS_KEY = "ss_users";

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
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  } catch (err) {
    // Backend offline — try local storage
    if (!err.response) {
      const users = getLocalUsers();
      const user = users.find((u) => u.email === email);
      if (!user) throw { response: { data: { error: "No account found with this email." } } };
      if (user.password !== password) throw { response: { data: { error: "Incorrect password." } } };
      const safeUser = { id: user.id, name: user.name, email: user.email };
      return { token: makeToken(safeUser), user: safeUser };
    }
    throw err;
  }
};

// ── Register ─────────────────────────────────────────────
export const register = async (name, email, password) => {
  try {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  } catch (err) {
    // Backend offline — save locally
    if (!err.response) {
      const users = getLocalUsers();
      if (users.find((u) => u.email === email))
        throw { response: { data: { error: "An account with this email already exists." } } };
      const user = { id: Date.now(), name, email, password };
      saveLocalUsers([...users, user]);
      const safeUser = { id: user.id, name, email };
      return { token: makeToken(safeUser), user: safeUser };
    }
    throw err;
  }
};
