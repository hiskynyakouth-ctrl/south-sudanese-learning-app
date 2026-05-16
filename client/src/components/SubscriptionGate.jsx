import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";

// ── Admin check helper ────────────────────────────────────
const isAdminUser = (user) => {
  if (!user) return false;
  return (
    user.role === "admin" ||
    user.email?.toLowerCase().includes("admin") ||
    user.email?.toLowerCase() === "thiyangkoang77@gmail.com" ||
    user.email?.toLowerCase() === "admin@school.com"
  );
};

// Wrap protected content — shows paywall if trial/subscription expired
export default function SubscriptionGate({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, isSubscribed, trialDaysRemaining, initTrial } = useSubscription();

  // Start trial on first access
  initTrial();

  // ── Admin: always free, full access, no subscription needed ──
  if (isAdminUser(user)) return children;

  const trialLeft = trialDaysRemaining();
  const access = hasAccess();

  if (access) {
    return (
      <>
        {/* Warning banner when trial is almost over */}
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

  // Paywall screen
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
        <p className="sub-paywall-period">per 2 months · 1 month free for new users</p>
        <button className="primary-button sub-paywall-btn"
          onClick={() => navigate("/subscription")}>
          View Plans &amp; Subscribe →
        </button>
        <button className="ghost-button" style={{ marginTop:8, width:"100%" }}
          onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
