import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";

// ── Payment methods per country ───────────────────────────
const PAYMENT_METHODS = {
  "South Sudan": [
    { name: "Salaam Bank",        type: "bank",   icon: "🏦", detail: "Account: 1234567890 | Branch: Juba Main" },
    { name: "Kenya Commercial Bank (KCB)", type: "bank", icon: "🏦", detail: "Account: 0987654321 | Branch: Juba" },
    { name: "Equity Bank",        type: "bank",   icon: "🏦", detail: "Account: 1122334455 | Branch: Juba" },
    { name: "MTN Mobile Money",   type: "mobile", icon: "📱", detail: "Send to: +211 912 345 678 | Name: Thiyang Koang" },
    { name: "Airtel Money",       type: "mobile", icon: "📱", detail: "Send to: +211 912 345 678 | Name: Thiyang Koang" },
    { name: "Cash Payment",       type: "cash",   icon: "💵", detail: "Contact us to arrange in-person payment in Juba" },
  ],
  "Uganda": [
    { name: "MTN Mobile Money",   type: "mobile", icon: "📱", detail: "Send to: +256 700 000 000 | Name: SS Elearning" },
    { name: "Airtel Money",       type: "mobile", icon: "📱", detail: "Send to: +256 700 000 000 | Name: SS Elearning" },
    { name: "Stanbic Bank",       type: "bank",   icon: "🏦", detail: "Account: 9030005678901 | Branch: Kampala" },
    { name: "Centenary Bank",     type: "bank",   icon: "🏦", detail: "Account: 3010012345678 | Branch: Kampala" },
    { name: "DFCU Bank",          type: "bank",   icon: "🏦", detail: "Account: 01234567890123 | Branch: Kampala" },
    { name: "Equity Bank Uganda", type: "bank",   icon: "🏦", detail: "Account: 1234567890 | Branch: Kampala" },
  ],
  "Ethiopia": [
    { name: "Telebirr",           type: "mobile", icon: "📱", detail: "Send to: +251 900 000 000 | Name: SS Elearning" },
    { name: "CBE Birr",           type: "mobile", icon: "📱", detail: "Commercial Bank of Ethiopia wallet — +251 900 000 000" },
    { name: "HelloCash",          type: "mobile", icon: "📱", detail: "Send to: +251 900 000 000 | Name: SS Elearning" },
    { name: "M-Pesa Ethiopia",    type: "mobile", icon: "📱", detail: "Send to: +251 900 000 000 | Name: SS Elearning" },
    { name: "Commercial Bank of Ethiopia (CBE)", type: "bank", icon: "🏦", detail: "Account: 1000123456789 | Branch: Addis Ababa" },
    { name: "Awash Bank",         type: "bank",   icon: "🏦", detail: "Account: 01234567890 | Branch: Addis Ababa" },
    { name: "Dashen Bank",        type: "bank",   icon: "🏦", detail: "Account: 0123456789012 | Branch: Addis Ababa" },
    { name: "Abyssinia Bank",     type: "bank",   icon: "🏦", detail: "Account: 123456789 | Branch: Addis Ababa" },
    { name: "Wegagen Bank",       type: "bank",   icon: "🏦", detail: "Account: 0123456789 | Branch: Addis Ababa" },
  ],
  "Kenya": [
    { name: "M-Pesa",             type: "mobile", icon: "📱", detail: "Paybill: 123456 | Account: SS Elearning | +254 700 000 000" },
    { name: "Airtel Money",       type: "mobile", icon: "📱", detail: "Send to: +254 700 000 000 | Name: SS Elearning" },
    { name: "T-Kash (Telkom)",    type: "mobile", icon: "📱", detail: "Send to: +254 700 000 000 | Name: SS Elearning" },
    { name: "Equity Bank Kenya",  type: "bank",   icon: "🏦", detail: "Account: 0123456789012 | Branch: Nairobi" },
    { name: "KCB Bank",           type: "bank",   icon: "🏦", detail: "Account: 1234567890 | Branch: Nairobi" },
    { name: "Co-operative Bank",  type: "bank",   icon: "🏦", detail: "Account: 01129876543200 | Branch: Nairobi" },
    { name: "Absa Bank Kenya",    type: "bank",   icon: "🏦", detail: "Account: 2000123456 | Branch: Nairobi" },
    { name: "NCBA Bank",          type: "bank",   icon: "🏦", detail: "Account: 1234567890 | Branch: Nairobi" },
  ],
  "Egypt": [
    { name: "Vodafone Cash",      type: "mobile", icon: "📱", detail: "Send to: +20 100 000 0000 | Name: SS Elearning" },
    { name: "Orange Money",       type: "mobile", icon: "📱", detail: "Send to: +20 100 000 0000 | Name: SS Elearning" },
    { name: "Etisalat Cash",      type: "mobile", icon: "📱", detail: "Send to: +20 100 000 0000 | Name: SS Elearning" },
    { name: "Fawry",              type: "mobile", icon: "📱", detail: "Fawry code: 123456789 | Available at any Fawry outlet" },
    { name: "National Bank of Egypt", type: "bank", icon: "🏦", detail: "Account: 1234567890123456 | Branch: Cairo" },
    { name: "Banque Misr",        type: "bank",   icon: "🏦", detail: "Account: 0123456789012345 | Branch: Cairo" },
    { name: "CIB Bank",           type: "bank",   icon: "🏦", detail: "Account: 100012345678 | Branch: Cairo" },
    { name: "QNB Alahli",         type: "bank",   icon: "🏦", detail: "Account: 0123456789 | Branch: Cairo" },
  ],
  "Sudan": [
    { name: "MTN Sudan",          type: "mobile", icon: "📱", detail: "Send to: +249 900 000 000 | Name: SS Elearning" },
    { name: "Zain Cash",          type: "mobile", icon: "📱", detail: "Send to: +249 900 000 000 | Name: SS Elearning" },
    { name: "Bank of Khartoum",   type: "bank",   icon: "🏦", detail: "Account: 1234567890 | Branch: Khartoum" },
    { name: "Omdurman National Bank", type: "bank", icon: "🏦", detail: "Account: 0987654321 | Branch: Khartoum" },
    { name: "Faisal Islamic Bank", type: "bank",  icon: "🏦", detail: "Account: 1122334455 | Branch: Khartoum" },
  ],
  "Western World": [
    { name: "PayPal",             type: "online", icon: "💳", detail: "Send to: thiyangkoang77@gmail.com | Note: SS Elearning Subscription" },
    { name: "Wise (TransferWise)", type: "online", icon: "💳", detail: "Email: thiyangkoang77@gmail.com | Fast international transfer" },
    { name: "Bank Transfer (SWIFT)", type: "bank", icon: "🏦", detail: "Contact us at thiyangkoang77@gmail.com for SWIFT details" },
    { name: "Credit/Debit Card",  type: "online", icon: "💳", detail: "Via PayPal — no PayPal account needed, pay as guest" },
  ],
  "Schools & Institutions": [
    { name: "PayPal",             type: "online", icon: "💳", detail: "Send to: thiyangkoang77@gmail.com | Note: School License" },
    { name: "Bank Transfer (SWIFT)", type: "bank", icon: "🏦", detail: "Contact us at thiyangkoang77@gmail.com for bank details" },
    { name: "Invoice Payment",    type: "online", icon: "📄", detail: "We can issue a formal invoice — email: thiyangkoang77@gmail.com" },
    { name: "Mobile Money",       type: "mobile", icon: "📱", detail: "Available for African institutions — contact us for details" },
  ],
};

const TYPE_COLORS = { bank: "#1565c0", mobile: "#2e7d32", online: "#6a1b9a", cash: "#e65100" };
const TYPE_LABELS = { bank: "Bank Transfer", mobile: "Mobile Money", online: "Online Payment", cash: "Cash" };

// ── Pricing plans ─────────────────────────────────────────
const PLANS = [
  { region: "South Sudan",          iso: "ss", price: "10,000 SSP", amount: 10000, currency: "SSP", period: "per 2 months", color: "#0f6b5b" },
  { region: "Uganda",               iso: "ug", price: "10,000 UGX", amount: 10000, currency: "UGX", period: "per 2 months", color: "#d4a017" },
  { region: "Ethiopia",             iso: "et", price: "200 ETB",    amount: 200,   currency: "ETB", period: "per 2 months", color: "#078930" },
  { region: "Kenya",                iso: "ke", price: "100 KES",    amount: 100,   currency: "KES", period: "per 2 months", color: "#006600" },
  { region: "Egypt",                iso: "eg", price: "100 EGP",    amount: 100,   currency: "EGP", period: "per 2 months", color: "#c8102e" },
  { region: "Sudan",                iso: "sd", price: "600 SDG",    amount: 600,   currency: "SDG", period: "per 2 months", color: "#d21034" },
  { region: "Western World",        iso: null, price: "$20 USD",    amount: 20,    currency: "USD", period: "per 2 months", color: "#1565c0", emoji: "🌍" },
  { region: "Schools & Institutions", iso: null, price: "$500 USD", amount: 500,   currency: "USD", period: "per year",     color: "#6a1b9a", emoji: "🏫", badge: "INSTITUTION" },
];

function PlanFlag({ plan, size = 36 }) {
  if (plan.iso) {
    return (
      <img src={`https://flagcdn.com/w80/${plan.iso}.png`} alt={plan.region}
        style={{ width: size * 1.5, height: size, objectFit: "cover", borderRadius: 5, boxShadow: "0 2px 8px rgba(0,0,0,0.18)", display: "block" }}
        onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} />
    );
  }
  return <span style={{ fontSize: size * 0.9, lineHeight: 1 }}>{plan.emoji}</span>;
}

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isTrialActive, trialDaysRemaining, isSubscribed, daysRemaining } = useSubscription();
  const [selected, setSelected] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [copied, setCopied] = useState(null);

  const trialLeft = trialDaysRemaining();
  const subbed = isSubscribed();
  const trialOn = isTrialActive();

  const copyDetail = (text, id) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const selectedPlan = selected !== null ? PLANS[selected] : null;
  const methods = selectedPlan ? (PAYMENT_METHODS[selectedPlan.region] || []) : [];

  // Group methods by type
  const grouped = methods.reduce((acc, m) => {
    if (!acc[m.type]) acc[m.type] = [];
    acc[m.type].push(m);
    return acc;
  }, {});

  return (
    <div className="sub-shell">

      {/* Header */}
      <div className="sub-header">
        <div className="sub-header-eyebrow">💳 South Sudan E-Learning Platform</div>
        <h1>Subscription Plans</h1>
        <p>Choose your country and payment method</p>

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

      {/* Free trial card */}
      <div className="sub-free-card">
        <div className="sub-free-icon">�</div>
        <div>
          <h3>Free Trial — 30 Days</h3>
          <p>Explore all features risk-free! Every new student and teacher gets a full month of unrestricted access. No payment needed.</p>
        </div>
      </div>

      {/* Step 1 — Choose your country */}
      <div className="sub-step-section">
        <div className="sub-step-header">
          <div className="sub-step-badge">1</div>
          <h3>Step 1 — Choose your country</h3>
        </div>
        <div className="sub-grid">
          {PLANS.map((plan, i) => (
            <div key={i}
              className={`sub-card${selected === i ? " selected" : ""}${plan.badge ? " institution" : ""}`}
              style={{ "--plan-color": plan.color, cursor:"pointer" }}
              onClick={() => { setSelected(i); setSelectedMethod(null); }}>

              {plan.badge && <div className="sub-badge">{plan.badge}</div>}

              <div className="sub-card-top">
                <PlanFlag plan={plan} size={32} />
                <span className="sub-card-region">{plan.region}</span>
              </div>
              <div className="sub-card-price" style={{ color: plan.color }}>{plan.price}</div>
              <div className="sub-card-period">{plan.period}</div>
              <div className="sub-card-divider" />
              <div className="sub-card-features">
                <div>✅ All subjects &amp; modules</div>
                <div>✅ Full notes &amp; quizzes</div>
                <div>✅ Official textbooks</div>
                <div>✅ Past exam papers</div>
                {plan.badge && <div>✅ Unlimited students</div>}
              </div>
              <div className="sub-select-indicator" style={{ background: selected === i ? plan.color : "var(--line)", color: selected === i ? "white" : "var(--muted)" }}>
                {selected === i ? "✓ Selected" : "Select →"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2 — Choose payment method */}
      {selectedPlan && (
        <div className="sub-payment-section">
          <div className="sub-step-header">
            <div className="sub-step-badge">2</div>
            <h3>Step 2 — Choose payment method</h3>
          </div>
          <p>
            <strong style={{ color: selectedPlan.color }}>{selectedPlan.region}</strong> • <strong>{selectedPlan.price}</strong> {selectedPlan.period}
          </p>

          {Object.entries(grouped).map(([type, typeMethods]) => (
            <div key={type} className="sub-method-group">
              <div className="sub-method-group-label" style={{ color: TYPE_COLORS[type] }}>
                {typeMethods[0].icon} {TYPE_LABELS[type]}
              </div>
              <div className="sub-methods-grid">
                {typeMethods.map((method, mi) => {
                  const id = `${type}-${mi}`;
                  const isSelected = selectedMethod === id;
                  return (
                    <div key={mi}
                      className={`sub-method-card${isSelected ? " selected" : ""}`}
                      style={{ "--method-color": TYPE_COLORS[type] }}
                      onClick={() => setSelectedMethod(isSelected ? null : id)}>
                      <div className="sub-method-header">
                        <span className="sub-method-icon">{method.icon}</span>
                        <span className="sub-method-name">{method.name}</span>
                        <span className="sub-method-chevron">{isSelected ? "▲" : "▼"}</span>
                      </div>

                      {isSelected && (
                        <div className="sub-method-detail">
                          <p>{method.detail}</p>
                          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:10 }}>
                            <button className="sub-copy-btn"
                              onClick={e => { e.stopPropagation(); copyDetail(method.detail, id); }}>
                              {copied === id ? "✅ Copied!" : "📋 Copy Details"}
                            </button>
                            <a href={`mailto:thiyangkoang77@gmail.com?subject=Payment Confirmation - ${selectedPlan.region}&body=Name: ${user?.name || ""}%0AEmail: ${user?.email || ""}%0APlan: ${selectedPlan.region} - ${selectedPlan.price}%0APayment Method: ${method.name}`}
                              className="sub-confirm-btn"
                              onClick={e => e.stopPropagation()}>
                              📧 Confirm Payment
                            </a>
                          </div>
                          <p className="sub-method-note">
                            After paying, send your <strong>name</strong>, <strong>email ({user?.email})</strong> and <strong>payment proof</strong> to confirm. Your account will be activated within 24 hours.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="ghost-button" style={{ justifySelf:"start" }} onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}
