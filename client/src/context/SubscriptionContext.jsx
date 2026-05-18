import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    country: "Ethiopia",
    flag: "🇪🇹",
    price: "200 ETB",
    color: "#18b318",
    popular: true,
  },
  {
    country: "Kenya",
    flag: "🇰🇪",
    price: "100 KES",
    color: "#17a517",
  },
  {
    country: "Uganda",
    flag: "🇺🇬",
    price: "10,000 UGX",
    color: "#ff9900",
  },
  {
    country: "South Sudan",
    flag: "🇸🇸",
    price: "10,000 SSP",
    color: "#0a9d8f",
  },
  {
    country: "Egypt",
    flag: "🇪🇬",
    price: "100 EGP",
    color: "#ff0000",
  },
  {
    country: "Sudan",
    flag: "🇸🇩",
    price: "600 SDG",
    color: "#ff0000",
  },
  {
    country: "Western World",
    flag: "🌍",
    price: "$20 USD",
    color: "#0057ff",
  },
  {
    country: "Schools & Institutions",
    flag: "🏫",
    price: "$500 USD",
    color: "#7b1fff",
    institution: true,
  },
];

const paymentMethods = [
  {
    name: "M-Pesa",
    icon: "📱",
    color: "#7b1fff",
  },
  {
    name: "KCB Bank",
    icon: "🏦",
    color: "#11a84f",
  },
  {
    name: "Airtel Money",
    icon: "💸",
    color: "#ff0000",
  },
  {
    name: "CBE Bank",
    icon: "🏛️",
    color: "#0057ff",
  },
  {
    name: "PayPal",
    icon: "🅿️",
    color: "#7b1fff",
  },
];

export default function SubscriptionPage() {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7ff",
        fontFamily: "sans-serif",
        paddingBottom: "50px",
      }}
    >
      {/* HERO */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#14005c,#2600c9)",
          color: "white",
          padding: "40px",
          borderBottomLeftRadius: "40px",
          borderBottomRightRadius: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>
              SS E-Learning
            </h2>

            <p style={{ opacity: 0.8 }}>
              Learn. Grow. Succeed
            </p>
          </div>

          <div
            style={{
              background: "white",
              color: "#14005c",
              padding: "10px 18px",
              borderRadius: "30px",
              fontWeight: "bold",
            }}
          >
            👤 Hello, Student
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "5rem",
              marginBottom: "10px",
            }}
          >
            Subscription{" "}
            <span style={{ color: "#ffc107" }}>
              Plans
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.3rem",
              opacity: 0.9,
            }}
          >
            Choose your country and payment
            method
          </p>
        </div>
      </div>

      {/* FREE TRIAL */}
      <div
        style={{
          width: "92%",
          margin: "-30px auto 30px",
          background: "white",
          borderRadius: "30px",
          padding: "25px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h2 style={{ color: "#17b617" }}>
            🎁 Free Trial
          </h2>

          <p>
            Explore all features risk-free!
          </p>
        </div>

        <div>
          <h2 style={{ color: "#17b617" }}>
            📅 7 Days Remaining
          </h2>

          <p>Enjoy your free trial</p>
        </div>

        <div>
          <p>✅ All Subjects</p>
          <p>✅ Quizzes</p>
        </div>

        <div>
          <p>✅ Past Papers</p>
          <p>✅ Video Tutorials</p>
        </div>
      </div>

      {/* STEP 1 */}
      <div style={{ width: "92%", margin: "auto" }}>
        <h2
          style={{
            marginBottom: "25px",
            color: "#25007a",
          }}
        >
          1️⃣ Step 1 — Choose Your Country
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: "25px",
          }}
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              onClick={() =>
                setSelectedPlan(index)
              }
              style={{
                background: "white",
                borderRadius: "25px",
                padding: "25px",
                position: "relative",
                border:
                  selectedPlan === index
                    ? `3px solid ${plan.color}`
                    : `2px solid ${plan.color}33`,
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "#17b617",
                    color: "white",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  POPULAR
                </div>
              )}

              {plan.institution && (
                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "#7b1fff",
                    color: "white",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  INSTITUTION
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                  }}
                >
                  {plan.flag}
                </div>

                <h3>{plan.country}</h3>
              </div>

              <h1
                style={{
                  color: plan.color,
                  marginBottom: "5px",
                }}
              >
                {plan.price}
              </h1>

              <p
                style={{
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                per 2 months
              </p>

              <div
                style={{
                  marginBottom: "25px",
                }}
              >
                <p>✅ All subjects & modules</p>
                <p>✅ Full notes & quizzes</p>
                <p>✅ Official textbooks</p>
                <p>✅ Past exam papers</p>
              </div>

              <button
                style={{
                  width: "100%",
                  background: plan.color,
                  color: "white",
                  border: "none",
                  padding: "15px",
                  borderRadius: "14px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Select Plan →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 2 */}
      <div
        style={{
          width: "92%",
          margin: "50px auto",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            color: "#25007a",
          }}
        >
          2️⃣ Step 2 — Choose Payment Method
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {paymentMethods.map(
            (method, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow:
                    "0 10px 20px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "10px",
                  }}
                >
                  {method.icon}
                </div>

                <h3>{method.name}</h3>

                <button
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    background: method.color,
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  📋 Copy Details
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* PAYMENT CONFIRM */}
      <div
        style={{
          width: "92%",
          margin: "auto",
          background: "white",
          borderRadius: "30px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#5f1dff",
            }}
          >
            📩 Payment Confirmation
          </h2>

          <p>
            After payment, send proof to:
          </p>

          <div
            style={{
              background: "#f4f1ff",
              padding: "15px",
              borderRadius: "14px",
              marginTop: "15px",
              fontWeight: "bold",
            }}
          >
            thiyangkoang77@gmail.com
          </div>

          <button
            style={{
              marginTop: "20px",
              background: "#5f1dff",
              color: "white",
              border: "none",
              padding: "14px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ✉ Send Confirmation Email
          </button>
        </div>

        <div>
          <h3
            style={{
              color: "#5f1dff",
            }}
          >
            Include:
          </h3>

          <p>✅ Full Name</p>
          <p>✅ Email Address</p>
          <p>✅ Payment Screenshot</p>
          <p>✅ Selected Country</p>
        </div>
      </div>

      {/* BACK BUTTON */}
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "white",
            border: "2px solid #ddd",
            padding: "14px 28px",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}