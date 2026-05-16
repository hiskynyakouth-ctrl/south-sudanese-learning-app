import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";

// ── Pricing data (no JSX in array — rendered inline) ──────
const PLANS = [
  { region: "South Sudan",          iso: "ss", price: "10,000 SSP", amount: 10000, currency: "SSP", period: "per 2 months", color: "#0f6b5b", payMethod: "flutterwave", payNote: "Mobile Money / Bank Transfer" },
  { region: "Uganda",               iso: "ug", price: "10,000 UGX", amount: 10000, currency: "UGX", period: "per 2 months", color: "#d4a017", payMethod: "flutterwave", payNote: "MTN Mobile Money / Airtel" },
  { region: "Ethiopia",             iso: "et", price: "200 ETB",    amount: 200,   currency: "ETB", period: "per 2 months", color: "#078930", payMethod: "flutterwave", payNote: "Telebirr / Bank Transfer" },
  { region: "Kenya",                iso: "ke", price: "100 KES",    amount: 100,   currency: "KES", period: "per 2 months", color: "#006600", payMethod: "flutterwave", payNote: "M-Pesa / Airtel Money" },
  { region: "Egypt",                iso: "eg", price: "100 EGP",    amount: 100,   currency: "EGP", period: "per 2 months", color: "#c8102e", payMethod: "flutterwave", payNote: "Card / Bank Transfer" },
  { region: "Sudan",                iso: "sd", price: "600 SDG",    amount: 600,   currency: "SDG", period: "per 2 months", color: "#d21034", payMethod: "flutterwave", payNote: "Mobile Money / Bank Transfer" },
  { region: "Western World",        iso: null, price: "$20 USD",    amount: 20,    currency: "USD", period: "per 2 months", color: "#1565c0", payMethod: "paypal",      payNote: "PayPal / Credit Card",   emoji: "🌍" },
  { region: "Schools & Institutions", iso: null, price: "$500 USD", amount: 500,   currency: "USD", period: "per year",     color: "#6a1b9a", payMethod: "paypal",      payNote: "PayPal / Bank Transfer", emoji: "🏫", badge: "INSTITUTION" },
];

// ── Flag image component ──────────────────────────────────
function PlanFlag({ plan, size = 40 }) {
  if (plan.iso) {
    return (
      <img
        src={`https://flagcdn.com/w80/${plan.iso}.png`}
        alt={plan.region}
        style={{ width: size * 1.5, height: size, objectFit: "cover", borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.18)", display: "block" }}
        onError={e => { e.target.onerror = null; e.target.style.display = "none"; }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.9, lineHeight: 1 }}>{plan.emoji}</span>;
}

// ── Load Flutterwave ──────────────────────────────────────
function loadFlutterwave() {
  return new Promise(resolve => {
    if (window.FlutterwaveCheckout) { resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.flutterwave.com/v3.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTrialActive, trialDaysRemaining, isSubscribed, daysRemaining, grantSubscription } = useSubscription();
  const [paying, setPaying] = useState(false);
  const [payingIdx, setPayingIdx] = useState(null);
  const [success, setSuccess] = useState(false);

  const trialLeft = trialDaysRemaining();
  const subbed = isSubscribed();
  const trialOn = isTrialActive();

  const payWithFlutterwave = async (plan, idx) => {
    setPaying(true); setPayingIdx(idx);
    await loadFlutterwave();
    const FLW_KEY = process.env.REACT_APP_FLW_PUBLIC_KEY || "FLWPUBK_TEST-XXXX";
    window.FlutterwaveCheckout({
      public_key: FLW_KEY,
      tx_ref: `ss-elearn-${Date.now()}`,
      amount: plan.amount,
      currency: plan.currency,
      payment_options: "mobilemoney,card,banktransfer,ussd",
      customer: { email: user?.email || "", name: user?.name || "" },
      customizations: {
        title: "South Sudan E-Learning",
        description: `${plan.region} — ${plan.price} ${plan.period}`,
        logo: "https://flagcdn.com/w40/ss.png",
      },
      callback: (res) => {
        if (res.status === "successful" || res.status === "completed") {
          grantSubscription(60);
          setSuccess(true);
        }
        setPaying(false); setPayingIdx(null);
      },
      onclose: () => { setPaying(false); setPayingIdx(null); },
    });
  };

  const payWithPayPal = (plan) => {
    const note = encodeURIComponent(`SS E-Learning ${plan.region} ${plan.price}`);
    window.open(`https://www.paypal.com/paypalme/thiyangkoang77/${plan.amount}${plan.currency}?note=${note}`, "_blank");
  };

  const handlePay = (plan, idx) => {
    if (plan.payMethod === "flutterwave") payWithFlutterwave(plan, idx);
    else payWithPayPal(plan);
  };

  if (success) {
    return (
      <div style={{ textAlign:"center", padding:"60px 20px", display:"grid", gap:20, placeItems:"center" }}>
        <div style={{ fontSize:"5rem" }}>🎉</div>
        <h1>Payment Successful!</h1>
        <p style={{ color:"var(--muted)", maxWidth:400 }}>Your subscription is now active. You have full access for 2 months.</p>
        <button className="primary-button" style={{ padding:"14px 32px" }} onClick={() => navigate("/streams/1")}>
          Start Learning →
        </button>
      </div>
    );
  }

  return (
    <div className="sub-shell">

      {/* ── Header ── */}
      <div className="sub-header">
        <span className="eyebrow">South Sudan E-Learning Platform</span>
        <h1>Subscription Plans</h1>
        <p>Full access to all subjects, textbooks, quizzes, notes and past papers.</p>

        {subbed ? (
          <div className="sub-trial-banner active">
            <span>✅</span>
            <div><strong>Subscribed — {daysRemaining()} days remaining</strong><p>You have full access.</p></div>
          </div>
        ) : trialOn ? (
          <div className="sub-trial-banner active">
            <span>🎉</span>
            <div>
              <strong>{trialLeft} day{trialLeft !== 1 ? "s" : ""} left in your free trial</strong>
              <p>Subscribe before your trial ends to keep learning.</p>
            </div>
          </div>
        ) : (
          <div className="sub-trial-banner expired">
            <span>⏰</span>
            <div><strong>Your free trial has ended</strong><p>Choose a plan below to continue.</p></div>
          </div>
        )}
      </div>

      {/* ── Free trial card ── */}
      <div className="sub-free-card">
        <div className="sub-free-icon">🆓</div>
        <div>
          <h3>1 Month Free for New Users</h3>
          <p>Every new student and teacher gets <strong>30 days completely free</strong> — no payment needed. After that, choose a plan.</p>
        </div>
      </div>

      {/* ── Plan cards ── */}
      <div className="sub-grid">
        {PLANS.map((plan, i) => (
          <div key={i} className={`sub-card${plan.badge ? " institution" : ""}`}
            style={{ "--plan-color": plan.color }}>

            {plan.badge && <div className="sub-badge">{plan.badge}</div>}

            {/* Flag + region */}
            <div className="sub-card-top">
              <PlanFlag plan={plan} size={36} />
              <span className="sub-card-region">{plan.region}</span>
            </div>

            {/* Price */}
            <div className="sub-card-price" style={{ color: plan.color }}>{plan.price}</div>
            <div className="sub-card-period">{plan.period}</div>

            <div className="sub-card-divider" />

            {/* Features */}
            <div className="sub-card-features">
              <div>✅ All subjects &amp; modules</div>
              <div>✅ Full notes &amp; quizzes</div>
              <div>✅ Official textbooks</div>
              <div>✅ Past exam papers</div>
              <div>✅ YouTube tutorials</div>
              {plan.badge && <div>✅ Unlimited students</div>}
            </div>

            <div className="sub-pay-method">💳 {plan.payNote}</div>

            {/* Pay button */}
            <button
              className="sub-pay-btn"
              style={{ background: plan.color, color: "white", border: "none" }}
              disabled={paying}
              onClick={() => handlePay(plan, i)}>
              {paying && payingIdx === i ? "Processing..." : `Pay ${plan.price} →`}
            </button>
          </div>
        ))}
      </div>

      {/* ── Setup note ── */}
      <div className="sub-setup-note">
        <strong>🔑 To activate real payments:</strong>
        <p>
          Sign up free at <a href="https://dashboard.flutterwave.com" target="_blank" rel="noreferrer">dashboard.flutterwave.com</a> →
          Settings → API Keys → copy your Public Key → add to <code>client/.env</code>:
          <br /><code>REACT_APP_FLW_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxx</code>
        </p>
      </div>

      <button className="ghost-button" style={{ justifySelf:"start" }} onClick={() => navigate(-1)}>← Back</button>

    </div>
  );
}
