import { createContext, useCallback, useContext, useMemo } from "react";

const SubscriptionContext = createContext(null);

const TRIAL_KEY   = "ss_trial_start";
const EXPIRY_KEY  = "ss_sub_expiry";
const TRIAL_DAYS  = 30;   // 1 month free
const SUB_DAYS    = 60;   // 2 months

// ── helpers ──────────────────────────────────────────────
const msPerDay = 1000 * 60 * 60 * 24;

const getTrialStart = () => {
  const raw = localStorage.getItem(TRIAL_KEY);
  return raw ? new Date(raw) : null;
};

const getSubExpiry = () => {
  const raw = localStorage.getItem(EXPIRY_KEY);
  return raw ? new Date(raw) : null;
};

// ── provider ─────────────────────────────────────────────
export const SubscriptionProvider = ({ children }) => {

  /** Set trial start date if not already set */
  const initTrial = useCallback(() => {
    if (!localStorage.getItem(TRIAL_KEY)) {
      localStorage.setItem(TRIAL_KEY, new Date().toISOString());
    }
  }, []);

  /** True if within 14-day trial window */
  const isTrialActive = useCallback(() => {
    const start = getTrialStart();
    if (!start) return false;
    const elapsed = (Date.now() - start.getTime()) / msPerDay;
    return elapsed < TRIAL_DAYS;
  }, []);

  /** True if paid subscription has not expired */
  const isSubscribed = useCallback(() => {
    const expiry = getSubExpiry();
    if (!expiry) return false;
    return expiry.getTime() > Date.now();
  }, []);

  /** True if user can access content */
  const hasAccess = useCallback(() => {
    // Check if current user is admin via localStorage session
    try {
      const session = JSON.parse(localStorage.getItem("sslauth") || "{}");
      const user = session?.user;
      if (user?.role === "admin" ||
          user?.email?.toLowerCase().includes("admin") ||
          user?.email?.toLowerCase() === "thiyangkoang77@gmail.com" ||
          user?.email?.toLowerCase() === "admin@school.com") {
        return true; // Admin always has access — free forever
      }
    } catch {}
    return isTrialActive() || isSubscribed();
  }, [isTrialActive, isSubscribed]);

  /** Days remaining in trial (0 if expired / not started) */
  const trialDaysRemaining = useCallback(() => {
    const start = getTrialStart();
    if (!start) return 0;
    const elapsed = (Date.now() - start.getTime()) / msPerDay;
    return Math.max(0, Math.ceil(TRIAL_DAYS - elapsed));
  }, []);

  /** Days remaining in active trial or subscription */
  const daysRemaining = useCallback(() => {
    if (isSubscribed()) {
      const expiry = getSubExpiry();
      return Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / msPerDay));
    }
    return trialDaysRemaining();
  }, [isSubscribed, trialDaysRemaining]);

  /** Days since trial ended (for paywall message) */
  const daysSinceTrialEnded = useCallback(() => {
    const start = getTrialStart();
    if (!start) return 0;
    const trialEnd = new Date(start.getTime() + TRIAL_DAYS * msPerDay);
    return Math.max(0, Math.floor((Date.now() - trialEnd.getTime()) / msPerDay));
  }, []);

  /** Admin: manually grant subscription for N days (default 60) */
  const grantSubscription = useCallback((days = SUB_DAYS) => {
    const expiry = new Date(Date.now() + days * msPerDay);
    localStorage.setItem(EXPIRY_KEY, expiry.toISOString());
  }, []);

  /** Admin: revoke subscription */
  const revokeSubscription = useCallback(() => {
    localStorage.removeItem(EXPIRY_KEY);
  }, []);

  const value = useMemo(() => ({
    initTrial,
    isTrialActive,
    isSubscribed,
    hasAccess,
    daysRemaining,
    trialDaysRemaining,
    daysSinceTrialEnded,
    grantSubscription,
    revokeSubscription,
    TRIAL_DAYS,
    SUB_DAYS,
  }), [
    initTrial, isTrialActive, isSubscribed, hasAccess,
    daysRemaining, trialDaysRemaining, daysSinceTrialEnded,
    grantSubscription, revokeSubscription,
  ]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
