import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import "../styles/subscription.css";

// ── Plans ─────────────────────────────────────────────────
const PLANS = [
  { region: "Ethiopia",    iso: "et", price: "200",    currency: "ETB", color: "#078930", gradient: "linear-gradient(135deg,#078930,#00b341)" },
  { region: "Kenya",       iso: "ke", price: "100",    currency: "KES", color: "#006600", gradient: "linear-gradient(135deg,#006600,#00a300)" },
  { region: "Uganda",      iso: "ug", price: "10,000", currency: "UGX", color: "#e65100", gradient: "linear-gradient(135deg,#e65100,#ff8f00)" },
  { region: "South Sudan", iso: "ss", price: "5,000",  currency: "SSP", color: "#0077b6", gradient: "linear-gradient(135deg,#0077b6,#00b4d8)" },
  { region: "Egypt",       iso: "eg", price: "100",    currency: "EGP", color: "#c8102e", gradient: "linear-gradient(135deg,#c8102e,#f44336)" },
  { region: "Sudan",       iso: "sd", price: "600",    currency: "SDG", color: "#6a1b9a", gradient: "linear-gradient(135deg,#6a1b9a,#9c27b0)" },
  { region: "Western World", iso: null, price: "$20",  currency: "USD", color: "#1565c0", gradient: "linear-gradient(135deg,#1565c0,#1e88e5)" },
];

// ── Inline SVG icons — zero network requests, always render ──
const ICONS = {
  // Mobile money — phone with signal bars
  mobile: (color) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="11" y="4" width="26" height="40" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5"/>
      <rect x="16" y="8" width="16" height="10" rx="2" fill={color} opacity="0.3"/>
      <circle cx="24" cy="38" r="2.5" fill={color}/>
      <rect x="20" y="10" width="8" height="1.5" rx="1" fill={color}/>
      {/* Signal bars */}
      <rect x="28" y="21" width="3" height="7" rx="1" fill={color}/>
      <rect x="32" y="19" width="3" height="9" rx="1" fill={color}/>
      <rect x="36" y="16" width="3" height="12" rx="1" fill={color}/>
    </svg>
  ),
  // Bank building
  bank: (color) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="6" y="38" width="36" height="4" rx="2" fill={color}/>
      <rect x="10" y="22" width="4" height="16" rx="1" fill={color} opacity="0.7"/>
      <rect x="17" y="22" width="4" height="16" rx="1" fill={color} opacity="0.7"/>
      <rect x="24" y="22" width="4" height="16" rx="1" fill={color} opacity="0.7"/>
      <rect x="31" y="22" width="4" height="16" rx="1" fill={color} opacity="0.7"/>
      <rect x="6" y="18" width="36" height="4" rx="1" fill={color}/>
      <polygon points="24,6 42,18 6,18" fill={color}/>
    </svg>
  ),
  // Card
  card: (color) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="4" y="12" width="40" height="26" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5"/>
      <rect x="4" y="18" width="40" height="8" fill={color} opacity="0.25"/>
      <rect x="10" y="30" width="12" height="3" rx="1.5" fill={color}/>
      <rect x="26" y="30" width="6" height="3" rx="1.5" fill={color} opacity="0.5"/>
    </svg>
  ),
  // Cash / money
  cash: (color) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="4" y="14" width="40" height="22" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2.5"/>
      <circle cx="24" cy="25" r="7" fill={color} opacity="0.25" stroke={color} strokeWidth="2"/>
      <text x="24" y="29" textAnchor="middle" fontSize="9" fontWeight="bold" fill={color}>$</text>
      <rect x="8" y="19" width="4" height="4" rx="1" fill={color} opacity="0.4"/>
      <rect x="36" y="27" width="4" height="4" rx="1" fill={color} opacity="0.4"/>
    </svg>
  ),
  // PayPal P
  paypal: (_) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="48" height="48" rx="12" fill="#f0f4ff"/>
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="26" fontWeight="900" fill="#003087">P</text>
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fontSize="26" fontWeight="900" fill="#009cde" dx="6" dy="4">P</text>
    </svg>
  ),
  // Wise W
  wise: (_) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="48" height="48" rx="12" fill="#9fe870"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="900" fill="#163300">W</text>
    </svg>
  ),
  // MTN — yellow circle M
  mtn: (_) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="24" cy="24" r="22" fill="#ffcc00"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="900" fill="#000">MTN</text>
    </svg>
  ),
  // M-Pesa — green M
  mpesa: (_) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="48" height="48" rx="10" fill="#00a651"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="900" fill="white">M-PESA</text>
    </svg>
  ),
  // Telebirr — blue T
  telebirr: (_) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="48" height="48" rx="10" fill="#0066cc"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="900" fill="white">T</text>
    </svg>
  ),
  // Airtel — red A
  airtel: (_) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="48" height="48" rx="10" fill="#e53935"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="900" fill="white">A</text>
    </svg>
  ),
  // Fawry — blue F
  fawry: (_) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="48" height="48" rx="10" fill="#1e88e5"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="900" fill="white">F</text>
    </svg>
  ),
  // Vodafone — red speech bubble V
  vodafone: (_) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="24" cy="24" r="22" fill="#cc0000"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="900" fill="white">V</text>
    </svg>
  ),
  // Orange — orange square O
  orange: (_) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="48" height="48" rx="6" fill="#ff6900"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="900" fill="white">O</text>
    </svg>
  ),
  // Swift — globe icon
  swift: (color) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2.5" fill="none"/>
      <ellipse cx="24" cy="24" rx="9" ry="18" stroke={color} strokeWidth="2" fill="none"/>
      <line x1="6" y1="24" x2="42" y2="24" stroke={color} strokeWidth="2"/>
      <line x1="24" y1="6" x2="24" y2="42" stroke={color} strokeWidth="2"/>
    </svg>
  ),
  // Receipt / invoice
  receipt: (color) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="8" y="4" width="32" height="40" rx="3" fill={color} opacity="0.12" stroke={color} strokeWidth="2.5"/>
      <line x1="14" y1="14" x2="34" y2="14" stroke={color} strokeWidth="2"/>
      <line x1="14" y1="20" x2="34" y2="20" stroke={color} strokeWidth="2"/>
      <line x1="14" y1="26" x2="26" y2="26" stroke={color} strokeWidth="2"/>
      <polygon points="28,32 36,32 32,40" fill={color}/>
    </svg>
  ),
};

// Map each method name → which icon + colors
const METHOD_STYLES = {
  "Telebirr":                          { svg: ICONS.telebirr,  color:"#0066cc", bg:"#deeeff" },
  "M-Pesa Ethiopia":                   { svg: ICONS.mpesa,     color:"#00a651", bg:"#d4f5e3" },
  "M-Pesa":                            { svg: ICONS.mpesa,     color:"#00a651", bg:"#d4f5e3" },
  "Commercial Bank of Ethiopia (CBE)": { svg: ICONS.bank,      color:"#003087", bg:"#dde8ff" },
  "CBE Mobile / Wallet":               { svg: ICONS.mobile,    color:"#003087", bg:"#dde8ff" },
  "Awash Bank":                        { svg: ICONS.bank,      color:"#c8102e", bg:"#ffe0e0" },
  "Dashen Bank":                       { svg: ICONS.bank,      color:"#006633", bg:"#d4f0e0" },
  "Abyssinia Bank":                    { svg: ICONS.bank,      color:"#7b1fa2", bg:"#f3e5f5" },
  "Wegagen Bank":                      { svg: ICONS.bank,      color:"#1565c0", bg:"#dde8ff" },
  "Airtel Money":                      { svg: ICONS.airtel,    color:"#e53935", bg:"#ffe0e0" },
  "T-Kash (Telkom)":                   { svg: ICONS.mobile,    color:"#6a1b9a", bg:"#f3e5f5" },
  "Equity Bank Kenya":                 { svg: ICONS.bank,      color:"#c8102e", bg:"#ffe0e0" },
  "Equity Bank Uganda":                { svg: ICONS.bank,      color:"#c8102e", bg:"#ffe0e0" },
  "Equity Bank":                       { svg: ICONS.bank,      color:"#c8102e", bg:"#ffe0e0" },
  "KCB Bank":                          { svg: ICONS.bank,      color:"#006633", bg:"#d4f0e0" },
  "Kenya Commercial Bank (KCB)":       { svg: ICONS.bank,      color:"#006633", bg:"#d4f0e0" },
  "Co-operative Bank":                 { svg: ICONS.bank,      color:"#0057a8", bg:"#dde8ff" },
  "Absa Bank Kenya":                   { svg: ICONS.bank,      color:"#cc0000", bg:"#ffe0e0" },
  "NCBA Bank":                         { svg: ICONS.bank,      color:"#003087", bg:"#dde8ff" },
  "MTN Mobile Money":                  { svg: ICONS.mtn,       color:"#e6a800", bg:"#fff9d0" },
  "MTN Sudan":                         { svg: ICONS.mtn,       color:"#e6a800", bg:"#fff9d0" },
  "MTN Sudan Mobile":                  { svg: ICONS.mtn,       color:"#e6a800", bg:"#fff9d0" },
  "Stanbic Bank":                      { svg: ICONS.bank,      color:"#0057a8", bg:"#dde8ff" },
  "Centenary Bank":                    { svg: ICONS.bank,      color:"#006633", bg:"#d4f0e0" },
  "DFCU Bank":                         { svg: ICONS.bank,      color:"#003087", bg:"#dde8ff" },
  "Salaam Bank":                       { svg: ICONS.bank,      color:"#006600", bg:"#d4f0e0" },
  "Cash Payment":                      { svg: ICONS.cash,      color:"#2e7d32", bg:"#d4f0da" },
  "Vodafone Cash":                     { svg: ICONS.vodafone,  color:"#cc0000", bg:"#ffe0e0" },
  "Orange Money":                      { svg: ICONS.orange,    color:"#ff6900", bg:"#fff0d0" },
  "Etisalat Cash":                     { svg: ICONS.mobile,    color:"#006633", bg:"#d4f0e0" },
  "Fawry":                             { svg: ICONS.fawry,     color:"#1e88e5", bg:"#dde8ff" },
  "National Bank of Egypt":            { svg: ICONS.bank,      color:"#003087", bg:"#dde8ff" },
  "Banque Misr":                       { svg: ICONS.bank,      color:"#6a1b9a", bg:"#f3e5f5" },
  "CIB Bank":                          { svg: ICONS.bank,      color:"#0057a8", bg:"#dde8ff" },
  "QNB Alahli":                        { svg: ICONS.bank,      color:"#8b0000", bg:"#ffe0e0" },
  "Zain Cash":                         { svg: ICONS.mobile,    color:"#cc0000", bg:"#ffe0e0" },
  "Bank of Khartoum":                  { svg: ICONS.bank,      color:"#1565c0", bg:"#dde8ff" },
  "Omdurman National Bank":            { svg: ICONS.bank,      color:"#006600", bg:"#d4f0e0" },
  "Faisal Islamic Bank":               { svg: ICONS.bank,      color:"#006600", bg:"#d4f0e0" },
  "PayPal":                            { svg: ICONS.paypal,    color:"#003087", bg:"#dde8ff" },
  "Wise (TransferWise)":               { svg: ICONS.wise,      color:"#37517e", bg:"#e8f0e0" },
  "Bank Transfer (SWIFT)":             { svg: ICONS.swift,     color:"#37474f", bg:"#eceff1" },
  "Credit/Debit Card":                 { svg: ICONS.card,      color:"#1a1f71", bg:"#e8f0ff" },
  "Invoice Payment":                   { svg: ICONS.receipt,   color:"#455a64", bg:"#eceff1" },
  "Mobile Money":                      { svg: ICONS.mobile,    color:"#e53935", bg:"#ffe0e0" },
};

const getMethodStyle = (name) =>
  METHOD_STYLES[name] || { svg: ICONS.card, color:"#607d8b", bg:"#eceff1" };

function MethodLogo({ name, size = 48 }) {
  const s = getMethodStyle(name);
  return (
    <div style={{ width: size, height: size, display:"flex", alignItems:"center", justifyContent:"center" }}>
      {s.svg(s.color)}
    </div>
  );
}

// ── Steps data ────────────────────────────────────────────
const STEPS = [
  { icon: "🌍", label: "Choose Country" },
  { icon: "💳", label: "Select Method"  },
  { icon: "📸", label: "Take Screenshot" },
  { icon: "📤", label: "Upload Receipt"  },
];

export default function Subscription() {
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const { trialDaysRemaining, paymentMethods } = useSubscription();

  const [step,           setStep]          = useState(1); // 1=plan, 2=method, 3=receipt
  const [selectedPlan,   setSelectedPlan]  = useState(null);
  const [selectedMethod, setSelectedMethod]= useState(null);
  const [receipt,        setReceipt]       = useState(null);   // { file, preview }
  const [copied,         setCopied]        = useState(null);
  const [submitted,      setSubmitted]     = useState(false);
  const fileRef = useRef();

  const trialLeft = trialDaysRemaining() > 0 ? trialDaysRemaining() : 0;

  const activePlan    = selectedPlan !== null ? PLANS[selectedPlan] : null;
  const activeMethods = activePlan ? (paymentMethods[activePlan.region] || []) : [];
  const activeMethod  = activeMethods.find(m => m.name === selectedMethod);

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setReceipt({ file, preview: url, name: file.name });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setReceipt({ file, preview: url, name: file.name });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!activePlan || !selectedMethod) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="sub-success-screen">
        <div className="sub-success-card">
          <div className="sub-success-icon">🎉</div>
          <h2>Request Submitted!</h2>
          <p>
            Your payment request for <strong>{activePlan?.region} — {activePlan?.price} {activePlan?.currency}</strong> via <strong>{selectedMethod}</strong> has been received.
          </p>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            We'll activate your subscription after verifying your payment. Usually within a few hours.
          </p>
          {receipt?.preview && (
            <img src={receipt.preview} alt="Receipt" style={{ maxWidth: 200, borderRadius: 10, margin: "16px auto", display: "block", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
          )}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
            <a
              href={`mailto:thiyangkoang77@gmail.com?subject=Payment - ${activePlan?.region} ${activePlan?.price} ${activePlan?.currency}&body=Name: ${user?.name || ""}%0AEmail: ${user?.email || ""}%0AMethod: ${selectedMethod || ""}`}
              className="sub-success-email-btn"
            >
              ✉️ Also Send Email Confirmation
            </a>
            <button className="sub-back-btn" onClick={() => navigate("/")}>← Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sub-shell-v2">

      {/* ── Colorful Header ── */}
      <div className="sub-header-v2">
        <div className="sub-header-orb sub-orb-1" />
        <div className="sub-header-orb sub-orb-2" />
        <div className="sub-header-orb sub-orb-3" />
        <div className="sub-header-v2-content">
          <div className="sub-header-badge">🎓 South Sudan E-Learning</div>
          <h1>Get Full Access</h1>
          <p>Choose your plan and unlock all subjects, notes, quizzes &amp; past papers</p>
          {trialLeft > 0 && (
            <div className="sub-trial-chip">⏱️ {trialLeft} free trial days remaining</div>
          )}
        </div>
      </div>

      {/* ── How it works (step indicator) ── */}
      <div className="sub-how-card">
        <h3 className="sub-how-title">How to Subscribe</h3>
        <div className="sub-how-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`sub-how-step ${i + 1 <= step ? "active" : ""}`}>
              <div className="sub-how-num">{i + 1}</div>
              <div className="sub-how-icon">{s.icon}</div>
              <div className="sub-how-label">{s.label}</div>
              {i < STEPS.length - 1 && <div className="sub-how-line" />}
            </div>
          ))}
        </div>
      </div>

      <div className="sub-body-v2">

        {/* ═══ STEP 1 — Choose country / plan ═══ */}
        <section className="sub-section">
          <div className="sub-section-head">
            <div className="sub-section-num">1</div>
            <div>
              <h2>Choose Your Country &amp; Plan</h2>
              <p>Select the country that matches your payment location</p>
            </div>
          </div>

          <div className="sub-country-grid">
            {PLANS.map((plan, i) => (
              <button
                key={i}
                className={`sub-country-card ${selectedPlan === i ? "selected" : ""}`}
                style={{ "--plan-color": plan.color, "--plan-gradient": plan.gradient }}
                onClick={() => { setSelectedPlan(i); setSelectedMethod(null); setStep(2); }}
              >
                {/* Selected tick */}
                {selectedPlan === i && <div className="sub-country-tick">✓</div>}

                {/* Flag or globe */}
                <div className="sub-country-flag">
                  {plan.iso
                    ? <img src={`https://flagcdn.com/w80/${plan.iso}.png`} alt={plan.region} />
                    : <span style={{ fontSize: 32 }}>🌍</span>
                  }
                </div>

                <div className="sub-country-name">{plan.region}</div>
                <div className="sub-country-price">
                  <span className="sub-price-num">{plan.price}</span>
                  <span className="sub-price-cur">{plan.currency}</span>
                </div>
                <div className="sub-country-dur">per 2 months</div>
              </button>
            ))}
          </div>
        </section>

        {/* ═══ STEP 2 — Payment method ═══ */}
        <section className={`sub-section ${!activePlan ? "sub-section-locked" : ""}`}>
          <div className="sub-section-head">
            <div className={`sub-section-num ${!activePlan ? "muted" : ""}`}>2</div>
            <div>
              <h2>Payment Information</h2>
              <p>
                {activePlan
                  ? `Select a payment method for ${activePlan.region} — ${activePlan.price} ${activePlan.currency}`
                  : "Complete the form below to submit your access request"}
              </p>
            </div>
          </div>

          {!activePlan ? (
            <div className="sub-placeholder">
              <span>⬆️ Select your country above first</span>
            </div>
          ) : (
            <>
              {/* Method cards */}
              <div className="sub-method-grid-v2">
                {activeMethods.map((m, i) => {
                  const style = getMethodStyle(m.name);
                  const isSelected = selectedMethod === m.name;
                  return (
                    <button
                      key={i}
                      className={`sub-method-card-v2 ${isSelected ? "selected" : ""}`}
                      style={{ "--m-color": style.color, "--m-bg": style.bg }}
                      onClick={() => { setSelectedMethod(m.name); setStep(3); }}
                    >
                      {isSelected && <div className="sub-method-tick">✓</div>}
                      <div className="sub-method-logo">
                        <MethodLogo name={m.name} size={48} />
                      </div>
                      <div className="sub-method-name-v2">{m.name}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected method details */}
              {activeMethod && (
                <div className="sub-method-detail-box">
                  <div className="sub-detail-left">
                    <span style={{ fontSize: 28 }}><MethodLogo name={activeMethod.name} size={40} /></span>
                    <div>
                      <div className="sub-detail-name">{activeMethod.name}</div>
                      <div className="sub-detail-info">{activeMethod.detail}</div>
                    </div>
                  </div>
                  <button
                    className="sub-detail-copy"
                    onClick={() => handleCopy(activeMethod.detail, "detail")}
                  >
                    {copied === "detail" ? "✅ Copied!" : "📋 Copy Details"}
                  </button>
                </div>
              )}

              {/* Price reminder */}
              {activePlan && (
                <div className="sub-amount-banner" style={{ background: activePlan.gradient }}>
                  <span>💰</span>
                  <span>Amount to pay:</span>
                  <strong>{activePlan.price} {activePlan.currency}</strong>
                </div>
              )}
            </>
          )}
        </section>

        {/* ═══ STEP 3 — Upload receipt ═══ */}
        <section className={`sub-section ${!selectedMethod ? "sub-section-locked" : ""}`}>
          <div className="sub-section-head">
            <div className={`sub-section-num ${!selectedMethod ? "muted" : ""}`}>3</div>
            <div>
              <h2>Payment Receipt <span className="sub-required">*</span></h2>
              <p>Upload a screenshot or photo of your payment receipt</p>
            </div>
          </div>

          {!selectedMethod ? (
            <div className="sub-placeholder">
              <span>⬆️ Select a payment method above first</span>
            </div>
          ) : (
            <>
              <div
                className={`sub-upload-zone ${receipt ? "has-file" : ""}`}
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                {receipt ? (
                  <div className="sub-upload-preview">
                    <img src={receipt.preview} alt="Receipt" />
                    <div className="sub-upload-filename">📄 {receipt.name}</div>
                    <button className="sub-upload-change" onClick={e => { e.stopPropagation(); setReceipt(null); }}>
                      ✕ Change
                    </button>
                  </div>
                ) : (
                  <div className="sub-upload-placeholder">
                    <div className="sub-upload-icon">⬆️</div>
                    <strong>Click to upload or drag and drop</strong>
                    <span>JPEG, PNG, WebP or PDF (Max 5MB)</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </div>

              {/* Contact info */}
              <div className="sub-contact-hint">
                <span>📧</span>
                <div>
                  <div>Or email your receipt directly to:</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <strong>thiyangkoang77@gmail.com</strong>
                    <button className="sub-inline-copy" onClick={() => handleCopy("thiyangkoang77@gmail.com", "email")}>
                      {copied === "email" ? "✅" : "📋 Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* ═══ Submit button ═══ */}
        <button
          className={`sub-submit-btn ${(!activePlan || !selectedMethod) ? "disabled" : ""}`}
          disabled={!activePlan || !selectedMethod}
          onClick={handleSubmit}
        >
          <span>⬆️</span>
          <span>
            {activePlan && selectedMethod
              ? `Submit Request — ${activePlan.price} ${activePlan.currency} via ${selectedMethod}`
              : "Upload Receipt & Request Access"}
          </span>
        </button>

        <button className="sub-back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>
    </div>
  );
}
