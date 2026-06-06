import { useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";

/**
 * Wraps protected content.
 * - If hasAccess() → renders children normally.
 * - Otherwise → renders a full-screen paywall overlay.
 */
export default function SubscriptionGuard({ children }) {
  const { hasAccess, daysSinceTrialEnded } = useSubscription();
  const navigate = useNavigate();

  if (hasAccess()) return children;

  const daysSince = daysSinceTrialEnded();

  return (
    <>
      {/* Blurred background content */}
      <div style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none" }}>
        {children}
      </div>

      {/* Paywall overlay */}
      <div className="sub-paywall">
        <div className="sub-paywall-card">
          <div className="sub-paywall-icon">🔒</div>
          <h2>Your free trial has ended</h2>
          <p className="sub-paywall-sub">
            {daysSince > 0
              ? `Your 30-day free trial ended ${daysSince} day${daysSince !== 1 ? "s" : ""} ago.`
              : "Your free trial has expired."}
          </p>
          <p className="sub-paywall-desc">
            Subscribe to continue accessing all textbooks, modules, past papers, and more.
          </p>

          <div className="sub-paywall-actions">
            <button
              className="sub-paywall-btn primary"
              onClick={() => navigate("/subscription")}
            >
              View Plans &amp; Pricing
            </button>
          </div>

          <a
            href="https://wa.me/message/YZO6RMBL5DPCO1"
            target="_blank"
            rel="noopener noreferrer"
            className="sub-paywall-contact"
          >
            Already paid? Contact admin on WhatsApp →
          </a>
        </div>
      </div>
    </>
  );
}
