import { useRef, useState } from "react";
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

// Bank / method logos by name
const METHOD_LOGOS = {
  "Telebirr":                      { emoji: "📱", color: "#0066cc", bg: "#e3f0ff" },
  "M-Pesa Ethiopia":               { emoji: "📱", color: "#00a651", bg: "#e6f9ee" },
  "M-Pesa":                        { emoji: "📱", color: "#00a651", bg: "#e6f9ee" },
  "MTN Mobile Money":              { emoji: "📱", color: "#ffcc00", bg: "#fff9e0" },
  "Airtel Money":                  { emoji: "📱", color: "#e53935", bg: "#fdecea" },
  "T-Kash (Telkom)":               { emoji: "📱", color: "#6a1b9a", bg: "#f3e5f5" },
  "Zain Cash":                     { emoji: "📱", color: "#cc0000", bg: "#fdecea" },
  "MTN Sudan Mobile":              { emoji: "📱", color: "#ffcc00", bg: "#fff9e0" },
  "Commercial Bank of Ethiopia (CBE)": { emoji: "🏦", color: "#003087", bg: "#e8eeff" },
  "CBE Mobile / Wallet":           { emoji: "🏦", color: "#003087", bg: "#e8eeff" },
  "Awash Bank":                    { emoji: "🏦", color: "#c8102e", bg: "#fdecea" },
  "Dashen Bank":                   { emoji: "🏦", color: "#006633", bg: "#e6f4ec" },
  "Abyssinia Bank":                { emoji: "🏦", color: "#7b1fa2", bg: "#f3e5f5" },
  "Wegagen Bank":                  { emoji: "🏦", color: "#1565c0", bg: "#e3f2fd" },
  "Equity Bank":                   { emoji: "🏦", color: "#c8102e", bg: "#fdecea" },
  "Equity Bank Kenya":             { emoji: "🏦", color: "#c8102e", bg: "#fdecea" },
  "Equity Bank Uganda":            { emoji: "🏦", color: "#c8102e", bg: "#fdecea" },
  "KCB Bank":                      { emoji: "🏦", color: "#006633", bg: "#e6f4ec" },
  "Kenya Commercial Bank (KCB)":   { emoji: "🏦", color: "#006633", bg: "#e6f4ec" },
  "Co-operative Bank":             { emoji: "🏦", color: "#0057a8", bg: "#e3f0ff" },
  "Absa Bank Kenya":               { emoji: "🏦", color: "#cc0000", bg: "#fdecea" },
  "NCBA Bank":                     { emoji: "🏦", color: "#003087", bg: "#e8eeff" },
  "Stanbic Bank":                  { emoji: "🏦", color: "#0057a8", bg: "#e3f0ff" },
  "Centenary Bank":                { emoji: "🏦", color: "#006633", bg: "#e6f4ec" },
  "DFCU Bank":                     { emoji: "🏦", color: "#003087", bg: "#e8eeff" },
  "Salaam Bank":                   { emoji: "🏦", color: "#006600", bg: "#e6f4ec" },
  "Vodafone Cash":                 { emoji: "📱", color: "#cc0000", bg: "#fdecea" },
  "Orange Money":                  { emoji: "📱", color: "#ff6900", bg: "#fff0e0" },
  "Etisalat Cash":                 { emoji: "📱", color: "#006633", bg: "#e6f4ec" },
  "Fawry":                         { emoji: "💳", color: "#1e88e5", bg: "#e3f2fd" },
  "National Bank of Egypt":        { emoji: "🏦", color: "#003087", bg: "#e8eeff" },
  "Banque Misr":                   { emoji: "🏦", color: "#6a1b9a", bg: "#f3e5f5" },
  "CIB Bank":                      { emoji: "🏦", color: "#0057a8", bg: "#e3f0ff" },
  "QNB Alahli":                    { emoji: "🏦", color: "#8b0000", bg: "#fdecea" },
  "Bank of Khartoum":              { emoji: "🏦", color: "#1565c0", bg: "#e3f2fd" },
  "Omdurman National Bank":        { emoji: "🏦", color: "#006600", bg: "#e6f4ec" },
  "Faisal Islamic Bank":           { emoji: "🏦", color: "#006600", bg: "#e6f4ec" },
  "PayPal":                        { emoji: "💳", color: "#003087", bg: "#e8eeff" },
  "Wise (TransferWise)":           { emoji: "💳", color: "#37517e", bg: "#eaf0ff" },
  "Bank Transfer (SWIFT)":         { emoji: "🏦", color: "#37474f", bg: "#eceff1" },
  "Credit/Debit Card":             { emoji: "💳", color: "#5e35b1", bg: "#ede7f6" },
  "Cash Payment":                  { emoji: "💵", color: "#2e7d32", bg: "#e8f5e9" },
  "MTN Sudan":                     { emoji: "📱", color: "#ffcc00", bg: "#fff9e0" },
  "Invoice Payment":               { emoji: "📄", color: "#455a64", bg: "#eceff1" },
  "Mobile Money":                  { emoji: "📱", color: "#e53935", bg: "#fdecea" },
};

const getMethodStyle = (name) => METHOD_LOGOS[name] || { emoji: "💳", color: "#607d8b", bg: "#eceff1" };

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
                      <div className="sub-method-logo">{style.emoji}</div>
                      <div className="sub-method-name-v2">{m.name}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected method details */}
              {activeMethod && (
                <div className="sub-method-detail-box">
                  <div className="sub-detail-left">
                    <span style={{ fontSize: 28 }}>{getMethodStyle(activeMethod.name).emoji}</span>
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
