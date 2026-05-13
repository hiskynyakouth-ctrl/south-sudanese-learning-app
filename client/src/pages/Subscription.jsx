import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";

const PLANS = [
  {
    region: "South Sudan",
    flag: "🇸🇸",
    price: "20,000 SSP",
    period: "per 2 months",
    color: "#0f6b5b",
    contact: "Pay via mobile money or bank. Contact: +211 912 345 678",
  },
  {
    region: "Uganda",
    flag: "🇺🇬",
    price: "15,000 UGX",
    period: "per 2 months",
    color: "#d4a017",
    contact: "Pay via MTN Mobile Money. Contact: +256 700 000 000",
  },
  {
    region: "Ethiopia",
    flag: "🇪🇹",
    price: "200 ETB",
    period: "per 2 months",
    color: "#078930",
    contact: "Pay via Telebirr. Contact: +251 900 000 000",
  },
  {
    region: "Kenya",
    flag: "🇰🇪",
    price: "400 KES",
    period: "per 2 months",
    color: "#006600",
    contact: "Pay via M-Pesa. Contact: +254 700 000 000",
  },
  {
    region: "Western World",
    flag: "🌍",
    price: "$20 USD",
    period: "per 2 months",
    color: "#1565c0",
    contact: "Pay via PayPal or bank transfer. Email: thiyangkoang77@gmail.com",
  },
  {
    region: "Schools & Institutions",
    flag: "🏫",
    price: "$2,000 USD",
    period: "per year",
    color: "#6a1b9a",
    badge: "INSTITUTION",
    contact: "Full school license for unlimited students. Email: thiyangkoang77@gmail.com",
  },
];

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTrialActive, trialDaysRemaining, isSubscribed, daysRemaining } = useSubscription();
  const [selected, setSelected] = useState(null);

  const trialLeft = trialDaysRemaining();
  const subbed = isSubscribed();
  const trialOn = isTrialActive();

  return (
    <div className="sub-shell">

      {/* Header */}
      <div className="sub-header">
        <span className="eyebrow">South Sudan E-Learning Platform</span>
        <h1>Subscription Plans</h1>
        <p>Full access to all subjects, textbooks, quizzes, notes and past papers.</p>

        {/* Status banner */}
        {subbed ? (
          <div className="sub-trial-banner active">
            <span>✅</span>
            <div>
              <strong>You are subscribed — {daysRemaining()} days remaining</strong>
              <p>You have full access to all content.</p>
            </div>
          </div>
        ) : trialOn ? (
          <div className="sub-trial-banner active">
            <span>🎉</span>
            <div>
              <strong>{trialLeft} day{trialLeft !== 1 ? "s" : ""} left in your free trial</strong>
              <p>Subscribe before your trial ends to keep learning without interruption.</p>
            </div>
          </div>
        ) : (
          <div className="sub-trial-banner expired">
            <span>⏰</span>
            <div>
              <strong>Your free trial has ended</strong>
              <p>Choose a plan below to continue accessing all content.</p>
            </div>
          </div>
        )}
      </div>

      {/* Free trial highlight */}
      <div className="sub-free-card">
        <div className="sub-free-icon">🆓</div>
        <div>
          <h3>1 Month Free for New Users</h3>
          <p>Every new student and teacher gets <strong>30 days completely free</strong> — no payment, no card needed. After that, choose a plan to continue.</p>
        </div>
      </div>

      {/* Plans grid */}
      <div className="sub-grid">
        {PLANS.map((plan, i) => (
          <div key={i}
            className={`sub-card${selected === i ? " selected" : ""}${plan.badge ? " institution" : ""}`}
            style={{ "--plan-color": plan.color }}
            onClick={() => setSelected(i)}>

            {plan.badge && <div className="sub-badge">{plan.badge}</div>}

            <div className="sub-card-top">
              <span className="sub-card-flag">{plan.flag}</span>
              <span className="sub-card-region">{plan.region}</span>
            </div>
            <div className="sub-card-price">{plan.price}</div>
            <div className="sub-card-period">{plan.period}</div>

            <div className="sub-card-divider" />

            <div className="sub-card-features">
              <div>✅ All subjects &amp; modules</div>
              <div>✅ Full notes &amp; quizzes</div>
              <div>✅ Official textbooks</div>
              <div>✅ Past exam papers</div>
              <div>✅ YouTube tutorials</div>
              {plan.badge && <div>✅ Unlimited students</div>}
            </div>

            <button className="sub-card-btn"
              style={{ background: selected === i ? plan.color : undefined }}
              onClick={e => { e.stopPropagation(); setSelected(i); }}>
              {selected === i ? "✓ Selected" : "Select Plan"}
            </button>
          </div>
        ))}
      </div>

      {/* Payment instructions */}
      {selected !== null && (
        <div className="sub-payment-box">
          <h3>💳 How to Pay — {PLANS[selected].region}</h3>
          <div className="sub-payment-amount">
            <span className="sub-payment-flag">{PLANS[selected].flag}</span>
            <strong>{PLANS[selected].price}</strong>
            <span>{PLANS[selected].period}</span>
          </div>

          <div className="sub-payment-steps">
            <div className="sub-step">
              <span className="sub-step-num">1</span>
              <p>{PLANS[selected].contact}</p>
            </div>
            <div className="sub-step">
              <span className="sub-step-num">2</span>
              <p>Send your <strong>full name</strong> and <strong>registered email ({user?.email})</strong> with the payment proof.</p>
            </div>
            <div className="sub-step">
              <span className="sub-step-num">3</span>
              <p>Your account will be activated within <strong>24 hours</strong> after payment is confirmed.</p>
            </div>
          </div>

          <a href={`mailto:thiyangkoang77@gmail.com?subject=Subscription - ${PLANS[selected].region}&body=Name: ${user?.name || ""}%0AEmail: ${user?.email || ""}%0APlan: ${PLANS[selected].region} - ${PLANS[selected].price}`}
            className="primary-button sub-contact-btn">
            📧 Send Payment Confirmation
          </a>
        </div>
      )}

      <button className="ghost-button" style={{ justifySelf:"start", marginTop:8 }}
        onClick={() => navigate(-1)}>
        ← Back
      </button>

    </div>
  );
}
