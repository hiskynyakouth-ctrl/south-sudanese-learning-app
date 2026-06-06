import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import api from "../services/api";

const isAdminUser = (user) => {
  if (!user) return false;
  return (
    user.role === "admin" ||
    user.email?.toLowerCase().includes("admin") ||
    user.email?.toLowerCase() === "thiyangkoang77@gmail.com" ||
    user.email?.toLowerCase() === "admin@school.com"
  );
};

export default function SubscriptionGate({ children }) {
  const navigate = useNavigate();
  const { user, token, saveSession } = useAuth();
  const { hasAccess, isSubscribed, trialDaysRemaining, initTrial, grantSubscription } = useSubscription();
  const [checking, setChecking] = useState(false);

  // Start trial on first access
  initTrial();

  // For real JWT users: check backend subscription status once per session
  useEffect(() => {
    if (!token?.startsWith("eyJ")) return;
    if (isSubscribed()) return; // already subscribed locally

    const lastCheck = sessionStorage.getItem("sub_checked");
    if (lastCheck) return; // already checked this session

    sessionStorage.setItem("sub_checked", "1");
    setChecking(true);

    api.get("/auth/me")
      .then(res => {
        const serverUser = res.data?.user;
        if (serverUser?.subscription_expiry) {
          const expiry = new Date(serverUser.subscription_expiry);
          if (expiry > new Date()) {
            // Activate locally from server data
            const days = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
            grantSubscription(days);
            // Update the session user object too
            saveSession({ token, user: { ...user, ...serverUser } });
          }
        }
      })
      .catch(() => {}) // offline/error — fall back to local
      .finally(() => setChecking(false));
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Admin: always full access
  if (isAdminUser(user)) return children;

  const trialLeft = trialDaysRemaining();
  const access = hasAccess();

  if (checking) return children; // don't flash paywall while checking

  if (access) {
    return (
      <>
        {!isSubscribed() && trialLeft <= 7 && trialLeft > 0 && (
          <div className="sub-reminder-bar">
            <span>⏰ {trialLeft} day{trialLeft !== 1 ? "s" : ""} left in your free trial</span>
            <button onClick={() => navigate("/subscription")} className="sub-reminder-btn">
              Subscribe Now →
            </button>
          </div>
        )}
        {children}
      </>
    );
  }

  // ── Paywall ──────────────────────────────────────────────
  return (
    <div className="sub-paywall">
      <div className="sub-paywall-inner">
        <div className="sub-paywall-icon">🔒</div>
        <h2>Your Free Trial Has Ended</h2>
        <p>
          Your 30-day free trial is over. Subscribe to continue accessing all subjects,
          textbooks, quizzes, notes and past papers.
        </p>
        <div className="sub-paywall-prices">
          <div className="sub-paywall-price"><img src="https://flagcdn.com/w20/ss.png" alt="SS" style={{width:20,borderRadius:2,verticalAlign:"middle",marginRight:5}} /> <strong>10,000 SSP</strong></div>
          <div className="sub-paywall-price"><img src="https://flagcdn.com/w20/ug.png" alt="UG" style={{width:20,borderRadius:2,verticalAlign:"middle",marginRight:5}} /> <strong>10,000 UGX</strong></div>
          <div className="sub-paywall-price"><img src="https://flagcdn.com/w20/et.png" alt="ET" style={{width:20,borderRadius:2,verticalAlign:"middle",marginRight:5}} /> <strong>200 ETB</strong></div>
          <div className="sub-paywall-price"><img src="https://flagcdn.com/w20/ke.png" alt="KE" style={{width:20,borderRadius:2,verticalAlign:"middle",marginRight:5}} /> <strong>100 KES</strong></div>
          <div className="sub-paywall-price"><img src="https://flagcdn.com/w20/eg.png" alt="EG" style={{width:20,borderRadius:2,verticalAlign:"middle",marginRight:5}} /> <strong>100 EGP</strong></div>
          <div className="sub-paywall-price"><img src="https://flagcdn.com/w20/sd.png" alt="SD" style={{width:20,borderRadius:2,verticalAlign:"middle",marginRight:5}} /> <strong>600 SDG</strong></div>
          <div className="sub-paywall-price">🌍 <strong>$20 USD</strong></div>
        </div>
        <p className="sub-paywall-period">per 2 months · 30-day free trial for new users</p>
        <button
          className="primary-button sub-paywall-btn"
          onClick={() => navigate("/subscription")}
        >
          View Plans &amp; Subscribe →
        </button>
        <a
          href="https://wa.me/message/YZO6RMBL5DPCO1"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display:"block", textAlign:"center", marginTop:10, color:"var(--primary)", fontSize:"0.88rem" }}
        >
          Already paid? Contact admin on WhatsApp →
        </a>
        <button className="ghost-button" style={{ marginTop:8, width:"100%" }}
          onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
