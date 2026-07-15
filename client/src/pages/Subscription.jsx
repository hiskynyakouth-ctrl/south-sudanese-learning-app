import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import api from "../services/api";
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

// ── Real logo images — local SVGs in /logos/ (always load, no CORS) ────────
const METHOD_LOGOS = {
  // ── Ethiopia ──────────────────────────────────────────────────────────────
  "Telebirr":
    { img:"/logos/telebirr.svg",   bg:"#0a54a0", color:"#fff", init:"T" },
  "M-Pesa Ethiopia":
    { img:"/logos/mpesa.svg",      bg:"#00a651", color:"#fff", init:"M-PESA" },
  "M-Pesa":
    { img:"/logos/mpesa.svg",      bg:"#00a651", color:"#fff", init:"M-PESA" },
  "Commercial Bank of Ethiopia (CBE)":
    { img:"/logos/cbe.svg",        bg:"#003087", color:"#fff", init:"CBE" },
  "CBE Mobile / Wallet":
    { img:"/logos/cbe.svg",        bg:"#003087", color:"#fff", init:"CBE" },
  "Awash Bank":
    { img:"/logos/awash.svg",      bg:"#c8102e", color:"#fff", init:"AWB" },
  "Dashen Bank":
    { img:"/logos/dashen.svg",     bg:"#004d1a", color:"#fff", init:"DSH" },
  "Abyssinia Bank":
    { img:"/logos/abyssinia.svg",  bg:"#7b1fa2", color:"#fff", init:"BOA" },
  "Wegagen Bank":
    { img:"/logos/wegagen.svg",    bg:"#1565c0", color:"#fff", init:"WGB" },
  // ── Kenya ─────────────────────────────────────────────────────────────────
  "Airtel Money":
    { img:"/logos/airtel.svg",     bg:"#e53935", color:"#fff", init:"AIRTEL" },
  "T-Kash (Telkom)":
    { img:null,                    bg:"#6a1b9a", color:"#fff", init:"T-K" },
  "Equity Bank Kenya":
    { img:"/logos/equity.svg",     bg:"#c8102e", color:"#fff", init:"EQ" },
  "Equity Bank Uganda":
    { img:"/logos/equity.svg",     bg:"#c8102e", color:"#fff", init:"EQ" },
  "Equity Bank":
    { img:"/logos/equity.svg",     bg:"#c8102e", color:"#fff", init:"EQ" },
  "KCB Bank":
    { img:"/logos/kcb.svg",        bg:"#006600", color:"#fff", init:"KCB" },
  "Kenya Commercial Bank (KCB)":
    { img:"/logos/kcb.svg",        bg:"#006600", color:"#fff", init:"KCB" },
  "Co-operative Bank":
    { img:"/logos/coop.svg",       bg:"#0057a8", color:"#fff", init:"COOP" },
  "Absa Bank Kenya":
    { img:"/logos/absa.svg",       bg:"#cc0000", color:"#fff", init:"ABSA" },
  "NCBA Bank":
    { img:null,                    bg:"#003087", color:"#fff", init:"NCBA" },
  // ── Uganda ────────────────────────────────────────────────────────────────
  "MTN Mobile Money":
    { img:"/logos/mtn.svg",        bg:"#ffcc00", color:"#000", init:"MTN" },
  "Stanbic Bank":
    { img:"/logos/stanbic.svg",    bg:"#003e7e", color:"#fff", init:"STB" },
  "Centenary Bank":
    { img:null,                    bg:"#006633", color:"#fff", init:"CEN" },
  "DFCU Bank":
    { img:null,                    bg:"#003087", color:"#fff", init:"DFCU" },
  // ── South Sudan ───────────────────────────────────────────────────────────
  "Salaam Bank":
    { img:null,                    bg:"#006600", color:"#fff", init:"SLM" },
  "Cash Payment":
    { img:null,                    bg:"#2e7d32", color:"#fff", init:"CASH" },
  // ── Egypt ─────────────────────────────────────────────────────────────────
  "Vodafone Cash":
    { img:"/logos/vodafone.svg",   bg:"#e60000", color:"#fff", init:"VF" },
  "Orange Money":
    { img:"/logos/orange.svg",     bg:"#ff6900", color:"#fff", init:"OR" },
  "Etisalat Cash":
    { img:null,                    bg:"#006633", color:"#fff", init:"ETI" },
  "Fawry":
    { img:"/logos/fawry.svg",      bg:"#1a6fba", color:"#fff", init:"FWR" },
  "National Bank of Egypt":
    { img:null,                    bg:"#003087", color:"#fff", init:"NBE" },
  "Banque Misr":
    { img:null,                    bg:"#6a1b9a", color:"#fff", init:"BM" },
  "CIB Bank":
    { img:null,                    bg:"#0057a8", color:"#fff", init:"CIB" },
  "QNB Alahli":
    { img:null,                    bg:"#8b0000", color:"#fff", init:"QNB" },
  // ── Sudan ─────────────────────────────────────────────────────────────────
  "MTN Sudan":
    { img:"/logos/mtn.svg",        bg:"#ffcc00", color:"#000", init:"MTN" },
  "MTN Sudan Mobile":
    { img:"/logos/mtn.svg",        bg:"#ffcc00", color:"#000", init:"MTN" },
  "Zain Cash":
    { img:"/logos/zain.svg",       bg:"#cc0000", color:"#fff", init:"ZAIN" },
  "Bank of Khartoum":
    { img:null,                    bg:"#1565c0", color:"#fff", init:"BOK" },
  "Omdurman National Bank":
    { img:null,                    bg:"#006600", color:"#fff", init:"ONB" },
  "Faisal Islamic Bank":
    { img:null,                    bg:"#006600", color:"#fff", init:"FIB" },
  // ── Western ───────────────────────────────────────────────────────────────
  "PayPal":
    { img:"/logos/paypal.svg",     bg:"#003087", color:"#fff", init:"PP" },
  "Wise (TransferWise)":
    { img:"/logos/wise.svg",       bg:"#9fe870", color:"#163300", init:"WISE" },
  "Bank Transfer (SWIFT)":
    { img:null,                    bg:"#37474f", color:"#fff", init:"SWIFT" },
  "Credit/Debit Card":
    { img:null,                    bg:"#1a1f71", color:"#fff", init:"CARD" },
  "Invoice Payment":
    { img:null,                    bg:"#455a64", color:"#fff", init:"INV" },
  "Mobile Money":
    { img:null,                    bg:"#e53935", color:"#fff", init:"MM" },
};

const getMethodStyle = (name) =>
  METHOD_LOGOS[name] || { img:null, bg:"#607d8b", color:"#fff", init: name.slice(0,3).toUpperCase() };

// Render real logo with branded-initials fallback
function MethodLogo({ name, size = 48 }) {
  const s = getMethodStyle(name);
  const [failed, setFailed] = React.useState(false);
  if (s.img && !failed) {
    return (
      <img src={s.img} alt={name} width={size} height={size}
        style={{ objectFit:"contain", borderRadius:6, display:"block" }}
        onError={() => setFailed(true)} />
    );
  }
  return (
    <div style={{
      width:size, height:size, borderRadius:8,
      background:s.bg, color:s.color,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontWeight:900, fontSize: Math.max(9, size * 0.25),
      letterSpacing:"-0.5px", textAlign:"center", lineHeight:1, padding:2,
    }}>
      {s.init}
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

  const handleSubmit = async () => {
    if (!activePlan || !selectedMethod) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("plan",     activePlan.region);
      fd.append("amount",   activePlan.price.replace(/,/g, ""));
      fd.append("currency", activePlan.currency);
      fd.append("method",   selectedMethod);
      if (user?.email) fd.append("email", user.email);
      if (user?.name)  fd.append("name",  user.name);
      if (receipt?.file) fd.append("receipt", receipt.file);

      await api.post("/payments/submit", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitted(true);
    } catch (err) {
      // If backend is offline, still mark as submitted — user sends email manually
      console.warn("Payment submit error:", err.message);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
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
          className={`sub-submit-btn ${(!activePlan || !selectedMethod || isSubmitting) ? "disabled" : ""}`}
          disabled={!activePlan || !selectedMethod || isSubmitting}
          onClick={handleSubmit}
        >
          <span>{isSubmitting ? "⏳" : "⬆️"}</span>
          <span>
            {isSubmitting ? "Submitting…" :
              activePlan && selectedMethod
                ? `Submit Request — ${activePlan.price} ${activePlan.currency} via ${selectedMethod}`
                : "Upload Receipt & Request Access"}
          </span>
        </button>

        <button className="sub-back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>
    </div>
  );
}
