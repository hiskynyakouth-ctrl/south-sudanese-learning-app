import { createContext, useCallback, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";

const ProgressContext = createContext(null);

const KEY = "ss_progress";

const getAll = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; } };
const saveAll = (d) => localStorage.setItem(KEY, JSON.stringify(d));

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const uid = user?.id || user?.email || "guest";

  const getUserProgress = useCallback(() => {
    const all = getAll();
    return all[uid] || {};
  }, [uid]);

  // Save quiz result
  const saveQuizResult = useCallback((subject, moduleTitle, classId, score, total) => {
    const all = getAll();
    if (!all[uid]) all[uid] = {};
    const key = `${subject}__${moduleTitle}__${classId}`;
    const prev = all[uid][key];
    all[uid][key] = {
      subject, moduleTitle, classId,
      score, total,
      percent: Math.round((score / total) * 100),
      passed: score >= total * 0.6,
      completedAt: new Date().toISOString(),
      bestScore: prev ? Math.max(prev.bestScore || 0, score) : score,
      attempts: (prev?.attempts || 0) + 1,
    };
    saveAll(all);
    // Add notification inline to avoid circular dependency
    const NOTIF_KEY = `ss_notifs_${uid}`;
    try {
      const notifs = JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
      const msg = `Quiz completed: ${moduleTitle} — ${score}/${total} (${Math.round((score/total)*100)}%)`;
      localStorage.setItem(NOTIF_KEY, JSON.stringify([
        { id: Date.now(), message: msg, type: "quiz", read: false, createdAt: new Date().toISOString() },
        ...notifs,
      ].slice(0, 50)));
    } catch {}
  }, [uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mark module as read
  const markModuleRead = useCallback((subject, moduleTitle, classId) => {
    const all = getAll();
    if (!all[uid]) all[uid] = {};
    const key = `read__${subject}__${moduleTitle}__${classId}`;
    if (!all[uid][key]) {
      all[uid][key] = { subject, moduleTitle, classId, readAt: new Date().toISOString() };
      saveAll(all);
    }
  }, [uid]);

  const isModuleRead = useCallback((subject, moduleTitle, classId) => {
    const p = getUserProgress();
    return !!p[`read__${subject}__${moduleTitle}__${classId}`];
  }, [getUserProgress]);

  const getQuizResult = useCallback((subject, moduleTitle, classId) => {
    const p = getUserProgress();
    return p[`${subject}__${moduleTitle}__${classId}`] || null;
  }, [getUserProgress]);

  // Get all completed quizzes
  const getAllQuizResults = useCallback(() => {
    const p = getUserProgress();
    return Object.values(p).filter(v => v.score !== undefined);
  }, [getUserProgress]);

  // Stats
  const getStats = useCallback(() => {
    const results = getAllQuizResults();
    const passed = results.filter(r => r.passed).length;
    const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.percent, 0) / results.length) : 0;
    const p = getUserProgress();
    const readCount = Object.keys(p).filter(k => k.startsWith("read__")).length;
    return { quizzesTaken: results.length, quizzesPassed: passed, avgScore, modulesRead: readCount };
  }, [getAllQuizResults, getUserProgress]);

  // ── Notifications ─────────────────────────────────────────
  const NOTIF_KEY = `ss_notifs_${uid}`;
  const getNotifications = useCallback(() => {
    try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]"); } catch { return []; }
  }, [NOTIF_KEY]);

  const addNotification = useCallback((message, type = "info") => {
    const notifs = getNotifications();
    const newNotif = { id: Date.now(), message, type, read: false, createdAt: new Date().toISOString() };
    localStorage.setItem(NOTIF_KEY, JSON.stringify([newNotif, ...notifs].slice(0, 50)));
  }, [getNotifications, NOTIF_KEY]);

  const markNotifRead = useCallback((id) => {
    const notifs = getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
  }, [getNotifications, NOTIF_KEY]);

  const markAllNotifsRead = useCallback(() => {
    const notifs = getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
  }, [getNotifications, NOTIF_KEY]);

  const unreadCount = useCallback(() => {
    return getNotifications().filter(n => !n.read).length;
  }, [getNotifications]);

  const clearNotifications = useCallback(() => {
    localStorage.setItem(NOTIF_KEY, "[]");
  }, [NOTIF_KEY]);

  const value = useMemo(() => ({
    saveQuizResult, markModuleRead, isModuleRead,
    getQuizResult, getAllQuizResults, getStats, getUserProgress,
    getNotifications, addNotification, markNotifRead, markAllNotifsRead,
    unreadCount, clearNotifications,
  }), [
    saveQuizResult, markModuleRead, isModuleRead,
    getQuizResult, getAllQuizResults, getStats, getUserProgress,
    getNotifications, addNotification, markNotifRead, markAllNotifsRead,
    unreadCount, clearNotifications,
  ]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export const useProgress = () => useContext(ProgressContext);
