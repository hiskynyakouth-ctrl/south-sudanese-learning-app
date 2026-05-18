import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";

// ─────────────────────────────────────────────
// Payment Methods
// ─────────────────────────────────────────────
const PAYMENT_METHODS = {
  Ethiopia: [
    {
      name: "Telebirr",
      type: "mobile",
      icon: "📱",
      detail: "Send to: +251 900 000 000",
    },
    {
      name: "CBE Bank",
      type: "bank",
      icon: "🏦",
      detail: "Account: 1000123456789",
    },
  ],

  Kenya: [
    {
      name: "M-Pesa",
      type: "mobile",
      icon: "📱",
      detail: "Paybill: 123456",
    },
    {
      name: "KCB Bank",
      type: "bank",
      icon: "🏦",
      detail: "Account: 123456789",
    },
  ],

  Uganda: [
    {
      name: "MTN Mobile Money",
      type: "mobile",
      icon: "📱",
      detail: "Send to: +256700000000",
    },
  ],

  "South Sudan": [
    {
      name: "MTN Mobile Money",
      type: "mobile",
      icon: "📱",
      detail: "Send to: +211912345678",
    },
  ],

  "Western World": [
    {
      name: "PayPal",
      type: "online",
      icon: "💳",
      detail: "paypal.me/thiyangkoang77",
    },
  ],
};

// ─────────────────────────────────────────────
// Plans
// ─────────────────────────────────────────────
const PLANS = [
  {
    region: "Ethiopia",
    iso: "et",
    price: "200 ETB",
    amount: 200,
    currency: "ETB",
    period: "2 Months",
    color: "#078930",
  },

  {
    region: "Kenya",
    iso: "ke",
    price: "100 KES",
    amount: 100,
    currency: "KES",
    period: "2 Months",
    color: "#006600",
  },

  {
    region: "Uganda",
    iso: "ug",
    price: "10,000 UGX",
    amount: 10000,
    currency: "UGX",
    period: "2 Months",
    color: "#d4a017",
  },

  {
    region: "South Sudan",
    iso: "ss",
    price: "5,000 SSP",
    amount: 5000,
    currency: "SSP",
    period: "2 Months",
    color: "#0f6b5b",
  },

  {
    region: "Western World",
    iso: null,
    emoji: "🌍",
    price: "$20 USD",
    amount: 20,
    currency: "USD",
    period: "2 Months",
    color: "#1565c0",
  },
];

// ─────────────────────────────────────────────
// Flag Component
// ─────────────────────────────────────────────
function PlanFlag({ plan }) {
  if (plan.iso) {
    return (
      <img
        src={`https://flagcdn.com/w80/${plan.iso}.png`}
        alt={plan.region}
        style={{
          width: 55,
          height: 38,
          objectFit: "cover",
          borderRadius: 6,
        }}
      />
    );
  }

  return (
    <span style={{ fontSize: "2rem" }}>
      {plan.emoji}
    </span>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function Subscription() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    isTrialActive,
    trialDaysRemaining,
    isSubscribed,
    daysRemaining,
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [copied, setCopied] = useState("");

  // ─────────────────────────
  // Copy Payment Details
  // ─────────────────────────
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(text);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  // ─────────────────────────
  // Current Methods
  // ─────────────────────────
  const methods =
    selectedPlan !== null
      ? PAYMENT_METHODS[PLANS[selectedPlan].region] || []
      : [];

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "10px",
          }}
        >
          Subscription Plans
        </h1>

        <p style={{ color: "#666" }}>
          Choose your country and payment method
        </p>
      </div>

      {/* Trial */}
      <div
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "14px",
          marginBottom: "35px",
        }}
      >
        <h3>🆓 Free Trial</h3>

        {isSubscribed() ? (
          <p>
            Subscription active — {daysRemaining()} days remaining
          </p>
        ) : isTrialActive() ? (
          <p>
            Trial active — {trialDaysRemaining()} days remaining
          </p>
        ) : (
          <p>Your trial has expired</p>
        )}
      </div>

      {/* Plans */}
      <h2 style={{ marginBottom: "20px" }}>
        Step 1 — Choose Country
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {PLANS.map((plan, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedPlan(index);
              setSelectedMethod(null);
            }}
            style={{
              border:
                selectedPlan === index
                  ? `3px solid ${plan.color}`
                  : "1px solid #ddd",

              borderRadius: "18px",
              padding: "22px",
              cursor: "pointer",
              transition: "0.3s",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              <PlanFlag plan={plan} />

              <h3>{plan.region}</h3>
            </div>

            <h2 style={{ color: plan.color }}>
              {plan.price}
            </h2>

            <p>{plan.period}</p>

            <hr />

            <div style={{ marginTop: "15px" }}>
              <p>✅ All Subjects</p>
              <p>✅ Quizzes</p>
              <p>✅ Textbooks</p>
              <p>✅ Past Papers</p>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Methods */}
      {selectedPlan !== null && (
        <>
          <h2
            style={{
              marginTop: "50px",
              marginBottom: "20px",
            }}
          >
            Step 2 — Payment Methods
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {methods.map((method, index) => (
              <div
                key={index}
                onClick={() => setSelectedMethod(index)}
                style={{
                  border:
                    selectedMethod === index
                      ? "2px solid #1565c0"
                      : "1px solid #ddd",

                  borderRadius: "16px",
                  padding: "20px",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <h3>
                  {method.icon} {method.name}
                </h3>

                <p
                  style={{
                    marginTop: "12px",
                    color: "#555",
                  }}
                >
                  {method.detail}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyText(method.detail);
                  }}
                  style={{
                    marginTop: "15px",
                    padding: "10px 18px",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    background: "#1565c0",
                    color: "#fff",
                  }}
                >
                  {copied === method.detail
                    ? "✅ Copied"
                    : "📋 Copy Details"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Email Confirmation */}
      {selectedPlan !== null && selectedMethod !== null && (
        <div
          style={{
            marginTop: "40px",
            background: "#f7f7f7",
            padding: "25px",
            borderRadius: "14px",
          }}
        >
          <h3>📧 Payment Confirmation</h3>

          <p>
            After payment, send proof to:
          </p>

          <p>
            <strong>
              thiyangkoang77@gmail.com
            </strong>
          </p>

          <p style={{ marginTop: "12px" }}>
            Include:
          </p>

          <ul>
            <li>Name</li>
            <li>Email</li>
            <li>Payment Screenshot</li>
            <li>Country</li>
          </ul>

          <a
            href={`mailto:thiyangkoang77@gmail.com?subject=Subscription Payment`}
            style={{
              display: "inline-block",
              marginTop: "18px",
              padding: "12px 20px",
              background: "#0f6b5b",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
            }}
          >
            Send Confirmation Email
          </a>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: "50px",
          padding: "12px 22px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
    </div>
  );
}