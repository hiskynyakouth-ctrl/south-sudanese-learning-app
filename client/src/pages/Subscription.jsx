import { useState } from "react";
import { useSubscription } from "../context/SubscriptionContext";

// ── Pricing data ──────────────────────────────────────────
const PLANS = [
  {
    id: "ss",
    country: "South Sudan",
    flag: "ss",
    currency: "SSP",
    price: "20,000",
    symbol: "SSP",
    featured: true,
    description: "For students & teachers in South Sudan",
  },
  {
    id: "ug",
    country: "Uganda",
    flag: "ug",
    currency: "UGX",
    price: "15,000",
    symbol: "UGX",
    featured: false,
    description: "For students & teachers in Uganda",
  },
  {
    id: "et",
    country: "Ethiopia",
    flag: "et",
    currency: "ETB",
    price: "200",
    symbol: "ETB",
    featured: false,
    description: "For students & teachers in Ethiopia",
  },
  {
    id: "ke",
    country: "Kenya",
    flag: "ke",
    currency: "KES",
    price: "400",
    symbol: "KES",
    featured: false,
    description: "For students & teachers in Kenya",
  },
  {
    id: "intl",
    country: "International",
    flag: "un",
    currency: "USD",
    price: "20",
    symbol: "$",
    featured: false,
    description: "Western world & international users",
  },
];

const INSTITUTION_PLAN = {
  id: "institution",
  country: "School / Institution",
  flag: "ss",
  currency: "USD",
  price: "2,000",
  symbol: "$",
  description: "Full school or institution license — unlimited students & teachers",
};

const FEATURES = [
  "Full textbook access",
  "All modules & notes",
  "Quizzes & exams",
  "Past papers",
  "YouTube tutorials",
];

// ── Sub-components ────────────────────────────────────────
function PricingCard({ plan, onSubscribe }) {
  return (
    <div className={`sub-card${plan.featured ? " featured" : ""}`}>
      {plan.featured && <div className="sub-card-badge">Most Popular</div>}

      <div className="sub-card-flag">
        <img
          src={`https://flagcdn.com/w80/${plan.flag}.png`}
          alt={`${plan.country} flag`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://flagcdn.com/w80/ss.png";
          }}
        />
      </div>

      <div className="sub-card-country">{plan.country}</div>
      <p className="sub-card-desc">{plan.description}</p>

      <div className="sub-card-price">
        <span className="sub-price-amount">
          {plan.symbol !== plan.currency ? plan.symbol : ""}{plan.price}
        </span>
        <span className="sub-price-currency"> {plan.currency}</span>
      </div>
      <div className="sub-price-period">per 2 months</div>

      <ul className="sub-features">
        {FEATURES.map((f) => (
          <li key={f}>
            <span className="sub-check">✅</span> {f}
          </li>
        ))}
      </ul>

      <button className="sub-subscribe-btn" onClick={() => onSubscribe(plan)}>
        Subscribe Now
      </button>
    </div>
  );
}

function InstitutionCard({ onSubscribe }) {
  return (
    <div className="sub-card sub-card-institution">
      <div className="sub-card-flag">
        <img src="https://flagcdn.com/w80/ss.png" alt="Institution" />
      </div>
      <div className="sub-card-country">🏫 {INSTITUTION_PLAN.country}</div>
      <p className="sub-card-desc">{INSTITUTION_PLAN.description}</p>

      <div className="sub-card-price">
        <span className="sub-price-amount">${INSTITUTION_PLAN.price}</span>
        <span className="sub-price-currency"> USD</span>
      </div>
      <div className="sub-price-period">annual license</div>

      <ul className="sub-features">
        {[...FEATURES, "Unlimited student accounts", "Teacher dashboard", "Admin controls"].map((f) => (
          <li key={f}>
            <span className="sub-check">✅</span> {f}
          </li>
        ))}
      </ul>

      <button className="sub-subscribe-btn sub-subscribe-btn-institution" onClick={() => onSubscribe(INSTITUTION_PLAN)}>
        Contact for License
      </button>
    </div>
  );
}

function PaymentModal({ plan, onClose }) {
  if (!plan) return null;

  return (
    <div className="sub-modal-overlay" onClick={onClose}>
      <div className="sub-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sub-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="sub-modal-icon">💳</div>
        <h2>Activate Your Subscription</h2>
        <p className="sub-modal-plan">
          Plan: <strong>{plan.country}</strong> — {plan.symbol !== plan.currency ? plan.symbol : ""}{plan.price} {plan.currency}
          {plan.id !== "institution" ? " / 2 months" : " / year"}
        </p>

        <div className="sub-modal-steps">
          <div className="sub-modal-step">
            <span className="sub-step-num">1</span>
            <span>Send payment via <strong>Mobile Money</strong> or <strong>Bank Transfer</strong></span>
          </div>
          <div className="sub-modal-step">
            <span className="sub-step-num">2</span>
            <span>WhatsApp your <strong>payment receipt</strong> to the admin</span>
          </div>
          <div className="sub-modal-step">
            <span className="sub-step-num">3</span>
            <span>Your account will be <strong>activated within 24 hours</strong></span>
          </div>
        </div>

        <a
          href="https://wa.me/message/YZO6RMBL5DPCO1"
          target="_blank"
          rel="noopener noreferrer"
          className="sub-modal-whatsapp"
        >
          <span>💬</span> Contact Admin on WhatsApp
        </a>

        <p className="sub-modal-note">
          After payment confirmation, your subscription will be activated and you'll have full access for{" "}
          {plan.id === "institution" ? "1 year" : "2 months"}.
        </p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function Subscription() {
  const { isTrialActive, trialDaysRemaining, isSubscribed, daysRemaining } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const trialActive = isTrialActive();
  const subscribed = isSubscribed();

  return (
    <div className="sub-page">
      {/* Hero */}
      <div className="sub-hero">
        <div className="sub-hero-inner">
          <div className="eyebrow">South Sudan E-Learning</div>
          <h1>Choose Your Plan</h1>
          <p>
            Unlock full access to textbooks, modules, past papers, quizzes, and YouTube tutorials
            for secondary school students across East Africa.
          </p>

          {/* Status banner */}
          {trialActive && (
            <div className="sub-status-banner trial">
              🎓 Free trial active — <strong>{trialDaysRemaining()} days remaining</strong>
            </div>
          )}
          {subscribed && (
            <div className="sub-status-banner subscribed">
              ✅ Subscribed — <strong>{daysRemaining()} days remaining</strong>
            </div>
          )}
          {!trialActive && !subscribed && (
            <div className="sub-status-banner expired">
              ⚠️ Your free trial has ended. Subscribe below to continue.
            </div>
          )}
        </div>
      </div>

      {/* Trial banner */}
      <div className="sub-trial-banner">
        <span className="sub-trial-icon">🎁</span>
        <div>
          <strong>2 Weeks Free for New Users!</strong>
          <span> — No payment needed. Start learning immediately after registration.</span>
        </div>
      </div>

      {/* Pricing grid */}
      <div className="sub-section">
        <h2 className="sub-section-title">Individual Plans</h2>
        <p className="sub-section-sub">Pick the plan for your country. All plans include 2 months of full access.</p>
        <div className="sub-grid">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} onSubscribe={setSelectedPlan} />
          ))}
        </div>
      </div>

      {/* Institution card */}
      <div className="sub-section">
        <h2 className="sub-section-title">Institution License</h2>
        <p className="sub-section-sub">For schools, colleges, and educational institutions.</p>
        <div className="sub-institution-wrap">
          <InstitutionCard onSubscribe={setSelectedPlan} />
        </div>
      </div>

      {/* FAQ / info */}
      <div className="sub-section sub-faq">
        <h2 className="sub-section-title">How it works</h2>
        <div className="sub-faq-grid">
          {[
            { icon: "🎓", title: "Free Trial", body: "All new users get 14 days of free access. No credit card required." },
            { icon: "📱", title: "Easy Payment", body: "Pay via Mobile Money or bank transfer, then WhatsApp your receipt to the admin." },
            { icon: "⚡", title: "Fast Activation", body: "Your account is activated within 24 hours of payment confirmation." },
            { icon: "📚", title: "Full Access", body: "Get 2 months of unlimited access to all content on the platform." },
          ].map((item) => (
            <div key={item.title} className="sub-faq-card">
              <span className="sub-faq-icon">{item.icon}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment modal */}
      <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
    </div>
  );
}
