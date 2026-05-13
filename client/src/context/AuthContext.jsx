import { createContext, useCallback, useContext, useMemo, useState } from "react";

const TRIAL_KEY = "ss_trial_start";

const AuthContext = createContext(null);

const STORAGE_KEY = "sslauth";

const getStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setStored = (session) => {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStored());

  const saveSession = useCallback((nextSession) => {
    setSession(nextSession);
    setStored(nextSession);
    // Set trial start date on first login/registration if not already set
    if (nextSession && !localStorage.getItem(TRIAL_KEY)) {
      localStorage.setItem(TRIAL_KEY, new Date().toISOString());
    }
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
  }, [saveSession]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      isLoading: false,   // no backend call — never blocks
      saveSession,
      logout,
    }),
    [session, saveSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
