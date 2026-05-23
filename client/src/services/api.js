import axios from "axios";
import { getApiBaseURL } from "./apiBase";

const STORAGE_KEY = "sslauth";

export const getStoredSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const setStoredSession = (session) => {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const api = axios.create({
  baseURL: getApiBaseURL(),
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const session = getStoredSession();
  // Only send token if it's a real JWT (not a local fallback token)
  if (session?.token && session.token.startsWith("eyJ")) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

export default api;
