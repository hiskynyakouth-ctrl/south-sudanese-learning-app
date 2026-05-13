import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";

// ── Real flag images ──────────────────────────────────────
const FLAG = ({ iso, size = 32 }) => (
  <img src={`https://flagcdn.com/w40/${iso}.png`} alt={iso}
    style={{ width: size, height: size * 0.67, objectFit: "cover", borderRadius: 4, display: "block" }}
    onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} />
);

// ── Pricing plans ─────────────────────────────────────────
const PLANS = [
  {
    region: "South Sudan",
    flagEl: <FLAG iso="ss" size={36} />,
    price: "10,000 SSP",
    amount: 10000,
    currency: "SSP",
    period: "per 2 months",
    color: "#0f6b5b",
    payMethod: "flutterwave",
    payNote: "Mobile Money / Bank Transfer",
  },
  {
    region: "Uganda",
    flagEl: <FLAG iso="ug" size={36} />,
    price: "10,000 UGX",
    amount: 10000,
    currency: "UGX",
    period: "per 2 months",
    color: "#d4a017",
    payMethod: "flutterwave",
    payNote: "MTN Mobile Money / Airtel",
  },
  {
    region: "Ethiopia",
    flagEl: <FLAG iso="et" size={36} />,
    price: "200 ETB",
    amount: 200,
    currency: "ETB",
    period: "per 2 months",
    color: "#078930",
    payMethod: "flutterwave",
    payNote: "Telebirr / Bank Transfer",
  },
  {
    region: "Kenya",
    flagEl: <FLAG iso="ke" size={36} />,
    price: "100 KES",
    amount: 100,
    currency: "KES",
    period: "per 2 months",
    color: "#006600",
    payMethod: "flutterwave",
    payNote: "M-Pesa / Airtel Money",
  },
  {
    region: "Western World",
    flagEl: <span style={{ fontSize: "2rem", lineHeight: 1 }}>🌍</span>,
    price: "$20 USD",
    amount: 20,
    currency: "USD",
    period: "per 2 months",
    color: "#1565c0",
    payMethod: "paypal",
    payNote: "PayPal / Credit Card",
  },
  {
    region: "Schools & Institutions",
    flagEl: <span style={{ fontSize: "2rem", lineHeight: 1 }}>🏫</span>,
    price: "$500 USD",
    amount: 500,
    currency: "USD",
    period: "per year",
    color: "#6a1b9a",
    badge: "INSTITUTION",
    payMethod: "paypal",
    payNote: "PayPal / Bank Transfer",
  },
];

// ── Load Flutterwave inline script ────────────────────────
function loadFlutterwave() {
  return new Promise((resolve) => {
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
  const [selected, setSelected] = useState(null);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const trialLeft = trialDaysRemaining();
  const subbed = isSubscribed();
  const trialOn = isTrialActive();

  // ── Flutterwave payment ───────────────────────────────
  const payWithFlutterwave = async (plan) => {
    setPaying(true);
    await loadFlutterwave();

    const FLW_KEY = process.env.REACT_APP_FLW_PUBLIC_KEY || "FLWPUBK_TEST-XXXX"; // replace with real key

    window.FlutterwaveCheckout({
      public_key: FLW_KEY,
      tx_ref: `ss-elearn-${Date.now()}`,
      amount: plan.amount,
      currency: plan.currency,
      payment_options: "mobilemoney,card,banktransfer,ussd",
      customer: {
        email: user?.email || "",
        name: user?.name || "",
      },
      customizations: {
        title: "South Sudan E-Learning",
        description: `${plan.region} Subscription — ${plan.price} ${plan.period}`,
        logo: "https://flagcdn.com/w40/ss.png",
      },
      callback: (response) => {
        if (response.status === "successful" || response.status === "completed") {
          grantSubscription(60); // grant 60 days
          setSuccess(true);
          setPaying(false);
          // Save to server
          fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5001/api"}/auth/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user?.email,
              plan: plan.region,
              txRef: response.tx_ref,
              amount: plan.amount,
              currency: plan.currency,
            }),
          }).catch(() => {});
        } else {
          setPaying(false);
        }
      },
      onclose: () => setPaying(false),
    });
  };

  // ── PayPal redirect ───────────────────────────────────
  const payWithPayPal = (plan) => {
    // Replace with your real PayPal.me link or PayPal button
    const paypalEmail = "thiyangkoang77@gmail.com";
    const note = encodeURIComponent(`SS E-Learning ${plan.region} ${plan.price}`);
    window.open(
      `https://www.paypal.com/paypalme/${paypalEmail}/${plan.amount}${plan.currency}?note=${note}`,
      "_blank"
    );
  };

  const handlePay = (plan) => {
    if (plan.payMethod === "flutterwave") {
      payWithFlutterwave(plan);
    } else {
      payWithPayPal(plan);
    }
  };

  // ── Success screen ────────────────────────────────────
  if (success) {
    return (
      <div className="sub-shell" style={{ textAlign: "center", placeItems: "center" }}>
        <div style={{ fontSize: "5rem" }}>🎉</div>
        <h1>Payment Successful!</h1>
        <p style={{ color: "var(--muted)" }}>
          Your subscription is now active. You have full access for 2 months.
        </p>
        <button className="primary-button" style={{ padding: "14px 32px" }}
          onClick={() => navigate("/streams/1")}>
          Start Learning →
        </button>
      </div>
    );
  }

  return (
    <div className="sub-shell">

      {/* Header */}
      <div className="sub-header">
        <span className="eyebrow">South Sudan E-Learning Platform</span>
        <h1>Subscription Plans</h1>
        <p>Full access to all subjects, textbooks, quizzes, notes and past papers.</p>

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
              <span className="sub-card-flag">{plan.flagEl}</span>
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

            <div className="sub-pay-method">
              <span>💳 {plan.payNote}</span>
            </div>

            <button
              className="sub-card-btn sub-pay-btn"
              style={{ background: plan.color, color: "white", border: "none" }}
              disabled={paying}
              onClick={e => { e.stopPropagation(); handlePay(plan); }}>
              {paying && selected === i ? "Processing..." : `Pay ${plan.price} →`}
            </button>
          </div>
        ))}
      </div>

      {/* Setup note */}
      <div className="sub-setup-note">
        <strong>🔑 Payment Setup Required</strong>
        <p>
          To activate real payments, add your Flutterwave public key to <code>client/.env</code>:
          <br /><code>REACT_APP_FLW_PUBLIC_KEY=FLWPUBK-xxxxxxxxxxxxxxxx</code>
          <br />Get your free key at <a href="https://dashboard.flutterwave.com" target="_blank" rel="noreferrer">dashboard.flutterwave.com</a>
        </p>
      </div>

      <button className="ghost-button" style={{ justifySelf: "start" }}
        onClick={() => navigate(-1)}>← Back</button>

    </div>
  );
}
