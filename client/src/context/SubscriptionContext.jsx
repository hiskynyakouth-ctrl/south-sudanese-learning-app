import { createContext, useContext, useEffect, useState } from "react";

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionEnd, setSubscriptionEnd] = useState(null);
  const [trialStart, setTrialStart] = useState(null);

  useEffect(() => {
    const savedSub = localStorage.getItem("subscriptionEnd");
    const savedTrial = localStorage.getItem("trialStart");

    if (savedSub) setSubscriptionEnd(savedSub);
    if (savedTrial) setTrialStart(savedTrial);
    else {
      const now = new Date().toISOString();
      localStorage.setItem("trialStart", now);
      setTrialStart(now);
    }
  }, []);

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

  const hasAccess = () => {
    return isSubscribed() || isTrialActive();
  };

  const grantSubscription = (days = 60) => {
    const end = new Date();
    end.setDate(end.getDate() + days);
    const iso = end.toISOString();
    localStorage.setItem("subscriptionEnd", iso);
    setSubscriptionEnd(iso);
  };

  const clearSubscription = () => {
    localStorage.removeItem("subscriptionEnd");
    setSubscriptionEnd(null);
  };

  // Payment methods per country — used by subscription pages/components
  const PAYMENT_METHODS = {
    "South Sudan": [
      { name: "Salaam Bank", type: "bank", icon: "🏦", detail: "Account: 1234567890 | Branch: Juba Main" },
      { name: "Kenya Commercial Bank (KCB)", type: "bank", icon: "🏦", detail: "Account: 0987654321 | Branch: Juba" },
      { name: "Equity Bank", type: "bank", icon: "🏦", detail: "Account: 1122334455 | Branch: Juba" },
      { name: "MTN Mobile Money", type: "mobile", icon: "📱", detail: "Send to: +211 912 345 678 | Name: Thiyang Koang" },
      { name: "Airtel Money", type: "mobile", icon: "📱", detail: "Send to: +211 912 345 678 | Name: Thiyang Koang" },
      { name: "Cash Payment", type: "cash", icon: "💵", detail: "Contact us to arrange in-person payment in Juba" },
    ],
    "Uganda": [
      { name: "MTN Mobile Money", type: "mobile", icon: "📱", detail: "Send to: +256 700 000 000 | Name: SS Elearning" },
      { name: "Airtel Money", type: "mobile", icon: "📱", detail: "Send to: +256 700 000 000 | Name: SS Elearning" },
      { name: "Stanbic Bank", type: "bank", icon: "🏦", detail: "Account: 9030005678901 | Branch: Kampala" },
      { name: "Centenary Bank", type: "bank", icon: "🏦", detail: "Account: 3010012345678 | Branch: Kampala" },
      { name: "DFCU Bank", type: "bank", icon: "🏦", detail: "Account: 01234567890123 | Branch: Kampala" },
      { name: "Equity Bank Uganda", type: "bank", icon: "🏦", detail: "Account: 1234567890 | Branch: Kampala" },
    ],
    "Ethiopia": [
      { name: "Telebirr", type: "mobile", icon: "📱", detail: "Send to: +251 977 638 959 | Name: SS Elearning" },
      { name: "M-Pesa Ethiopia", type: "mobile", icon: "📱", detail: "Send to: +251 70 757 3507 | Name: SS Elearning" },
      { name: "Commercial Bank of Ethiopia (CBE)", type: "bank", icon: "🏦", detail: "Account: 1000479568848 | Branch: Addis Ababa" },
      { name: "CBE Mobile / Wallet", type: "mobile", icon: "📱", detail: "CBE wallet support — number: +251 977 638 959" },
      { name: "Awash Bank", type: "bank", icon: "🏦", detail: "Account: 01234567890 | Branch: Addis Ababa" },
      { name: "Dashen Bank", type: "bank", icon: "🏦", detail: "Account: 0123456789012 | Branch: Addis Ababa" },
      { name: "Abyssinia Bank", type: "bank", icon: "🏦", detail: "Account: 123456789 | Branch: Addis Ababa" },
      { name: "Wegagen Bank", type: "bank", icon: "🏦", detail: "Account: 0123456789 | Branch: Addis Ababa" },
    ],
    "Kenya": [
      { name: "M-Pesa", type: "mobile", icon: "📱", detail: "Paybill: 123456 | Account: SS Elearning | +254 700 000 000" },
      { name: "Airtel Money", type: "mobile", icon: "📱", detail: "Send to: +254 700 000 000 | Name: SS Elearning" },
      { name: "T-Kash (Telkom)", type: "mobile", icon: "📱", detail: "Send to: +254 700 000 000 | Name: SS Elearning" },
      { name: "Equity Bank Kenya", type: "bank", icon: "🏦", detail: "Account: 0123456789012 | Branch: Nairobi" },
      { name: "KCB Bank", type: "bank", icon: "🏦", detail: "Account: 1234567890 | Branch: Nairobi" },
      { name: "Co-operative Bank", type: "bank", icon: "🏦", detail: "Account: 01129876543200 | Branch: Nairobi" },
      { name: "Absa Bank Kenya", type: "bank", icon: "🏦", detail: "Account: 2000123456 | Branch: Nairobi" },
      { name: "NCBA Bank", type: "bank", icon: "🏦", detail: "Account: 1234567890 | Branch: Nairobi" },
    ],
    "Egypt": [
      { name: "Vodafone Cash", type: "mobile", icon: "📱", detail: "Send to: +20 100 000 0000 | Name: SS Elearning" },
      { name: "Orange Money", type: "mobile", icon: "📱", detail: "Send to: +20 100 000 0000 | Name: SS Elearning" },
      { name: "Etisalat Cash", type: "mobile", icon: "📱", detail: "Send to: +20 100 000 0000 | Name: SS Elearning" },
      { name: "Fawry", type: "mobile", icon: "📱", detail: "Fawry code: 123456789 | Available at any Fawry outlet" },
      { name: "National Bank of Egypt", type: "bank", icon: "🏦", detail: "Account: 1234567890123456 | Branch: Cairo" },
      { name: "Banque Misr", type: "bank", icon: "🏦", detail: "Account: 0123456789012345 | Branch: Cairo" },
      { name: "CIB Bank", type: "bank", icon: "🏦", detail: "Account: 100012345678 | Branch: Cairo" },
      { name: "QNB Alahli", type: "bank", icon: "🏦", detail: "Account: 0123456789 | Branch: Cairo" },
    ],
    "Sudan": [
      { name: "MTN Sudan", type: "mobile", icon: "📱", detail: "Send to: +249 900 000 000 | Name: SS Elearning" },
      { name: "Zain Cash", type: "mobile", icon: "📱", detail: "Send to: +249 900 000 000 | Name: SS Elearning" },
      { name: "Bank of Khartoum", type: "bank", icon: "🏦", detail: "Account: 1234567890 | Branch: Khartoum" },
      { name: "Omdurman National Bank", type: "bank", icon: "🏦", detail: "Account: 0987654321 | Branch: Khartoum" },
      { name: "Faisal Islamic Bank", type: "bank", icon: "🏦", detail: "Account: 1122334455 | Branch: Khartoum" },
    ],
    "Western World": [
      { name: "PayPal", type: "online", icon: "💳", detail: "Send to: thiyangkoang77@gmail.com | Note: SS Elearning Subscription" },
      { name: "Wise (TransferWise)", type: "online", icon: "💳", detail: "Email: thiyangkoang77@gmail.com | Fast international transfer" },
      { name: "Bank Transfer (SWIFT)", type: "bank", icon: "🏦", detail: "Contact us at thiyangkoang77@gmail.com for SWIFT details" },
      { name: "Credit/Debit Card", type: "online", icon: "💳", detail: "Via PayPal — no PayPal account needed, pay as guest" },
    ],
    "Schools & Institutions": [
      { name: "PayPal", type: "online", icon: "💳", detail: "Send to: thiyangkoang77@gmail.com | Note: School License" },
      { name: "Bank Transfer (SWIFT)", type: "bank", icon: "🏦", detail: "Contact us at thiyangkoang77@gmail.com for bank details" },
      { name: "Invoice Payment", type: "online", icon: "📄", detail: "We can issue a formal invoice — email: thiyangkoang77@gmail.com" },
      { name: "Mobile Money", type: "mobile", icon: "📱", detail: "Available for African institutions — contact us for details" },
    ],
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
        paymentMethods: PAYMENT_METHODS,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
