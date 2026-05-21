import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const SubscriptionContext = createContext();

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function SubscriptionProvider({ children }) {
  const [subscriptionEnd, setSubscriptionEnd] =
    useState(null);

  const [trialStart, setTrialStart] =
    useState(null);

  // Load saved data
  useEffect(() => {
    const savedSub =
      localStorage.getItem("subscriptionEnd");

    const savedTrial =
      localStorage.getItem("trialStart");

    if (savedSub) {
      setSubscriptionEnd(savedSub);
    }

    if (savedTrial) {
      setTrialStart(savedTrial);
    } else {
      const now = new Date().toISOString();

      localStorage.setItem(
        "trialStart",
        now
      );

      setTrialStart(now);
    }
  }, []);

  // ─────────────────────────────────────────
  // Trial
  // ─────────────────────────────────────────
  const TRIAL_DAYS = 30;

  const initTrial = () => {
    if (trialStart) return;

    const now = new Date().toISOString();

    localStorage.setItem("trialStart", now);
    setTrialStart(now);
  };

  const getTrialDiffDays = () => {
    if (!trialStart) return 0;

    const start = new Date(trialStart);
    const now = new Date();
    return (now - start) / (1000 * 60 * 60 * 24);
  };

  const isTrialActive = () => {
    const diff = getTrialDiffDays();
    return trialStart !== null && diff < TRIAL_DAYS;
  };

  const trialDaysRemaining = () => {
    const diff = getTrialDiffDays();
    return Math.max(0, Math.ceil(TRIAL_DAYS - diff));
  };

  const daysSinceTrialEnded = () => {
    const diff = getTrialDiffDays();
    if (diff <= TRIAL_DAYS) return 0;
    return Math.max(0, Math.ceil(diff - TRIAL_DAYS));
  };

  const hasAccess = () => {
    return isSubscribed() || isTrialActive();
  };

  // ─────────────────────────────────────────
  // Subscription
  // ─────────────────────────────────────────
  const isSubscribed = () => {
    if (!subscriptionEnd) return false;

    return new Date(subscriptionEnd) > new Date();
  };

  const daysRemaining = () => {
    if (!subscriptionEnd) return 0;

    const end = new Date(subscriptionEnd);
    const now = new Date();
    const diff = (end - now) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(diff));
  };

  // ─────────────────────────────────────────
  // Grant Subscription
  // ─────────────────────────────────────────
  const grantSubscription = (days = 60) => {
    const end = new Date();
    end.setDate(end.getDate() + days);
    const iso = end.toISOString();

    localStorage.setItem("subscriptionEnd", iso);
    setSubscriptionEnd(iso);
  };

  // ─────────────────────────────────────────
  // Remove Subscription
  // ─────────────────────────────────────────
  const clearSubscription = () => {
    localStorage.removeItem("subscriptionEnd");
    setSubscriptionEnd(null);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        initTrial,
        hasAccess,
        isTrialActive,
        trialDaysRemaining,
        daysSinceTrialEnded,
        isSubscribed,
        daysRemaining,
        grantSubscription,
        clearSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useSubscription() {
  return useContext(
    SubscriptionContext
  );
}

export default SubscriptionContext;