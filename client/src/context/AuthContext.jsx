import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api, { getStoredSession, setStoredSession } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStoredSession());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const stored = getStoredSession();

      if (!stored?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        const nextSession = { token: stored.token, user: data.user };
        setSession(nextSession);
        setStoredSession(nextSession);
      } catch (error) {
        setSession(null);
        setStoredSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, []);

  const saveSession = useCallback((nextSession) => {
    setSession(nextSession);
    setStoredSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
  }, [saveSession]);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      isLoading,
      saveSession,
      logout,
    }),
    [session, isLoading, saveSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
