import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import "../styles/subscription.css";

const PLANS = [
  { region: "Ethiopia", iso: "et", price: "200", currency: "ETB", duration: "2 Months", color: "#078930" },
  { region: "Kenya", iso: "ke", price: "100", currency: "KES", duration: "2 Months", color: "#006600" },
  { region: "Uganda", iso: "ug", price: "10,000", currency: "UGX", duration: "2 Months", color: "#FF9800" },
  { region: "South Sudan", iso: "ss", price: "5,000", currency: "SSP", duration: "2 Months", color: "#008080" },
  { region: "Egypt", iso: "eg", price: "100", currency: "EGP", duration: "2 Months", color: "#c8102e" },
  { region: "Sudan", iso: "sd", price: "600", currency: "SDG", duration: "2 Months", color: "#d21034" },
];

const WESTERN_PLAN = { region: "Western World", price: "$20", currency: "USD", duration: "2 Months", color: "#0033A0" };


const FEATURES = ["All Subjects", "Quizzes", "Textbooks", "Past Papers"];

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trialDaysRemaining, paymentMethods } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [copied, setCopied] = useState(null);

  const trialLeft = trialDaysRemaining() > 0 ? trialDaysRemaining() : 7;

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const getActivePlan = () => {
    if (selectedPlan === null) return null;
    if (selectedPlan === 'western') return WESTERN_PLAN;
    return PLANS[selectedPlan];
  };

  const activePlan = getActivePlan();
  const selectedPlanName = selectedPlan === 'western' ? 'Western World' : activePlan?.region;
  const activeMethods = selectedPlanName ? paymentMethods[selectedPlanName] || [] : [];
  const selectedMethodItem = activeMethods.find((method) => method.name === selectedMethod);

  return (
    <div className="sub-shell-new">
      {/* HEADER SECTION */}
      <div className="sub-header-new">
        <div className="sub-header-bg"></div>
        <div className="sub-header-content">
          <div className="sub-header-pill">
            🎓 South Sudan E-Learning Platform
          </div>
          <h1>Subscription Plans</h1>
          <p>Choose your country and payment method</p>
        </div>
      </div>

      <div className="sub-content-container">
        {/* FREE TRIAL BANNER */}
        <div className="sub-free-banner">
          <div className="sub-free-left">
            <div className="sub-free-icon-box green-icon">🎁</div>
            <div className="sub-free-text">
              <h3 className="green-text">Free Trial</h3>
              <p>Explore all features risk-free!</p>
            </div>
          </div>
          <div className="sub-free-divider"></div>
          <div className="sub-free-right">
            <div className="sub-free-icon-box outline-green-icon">⏱️</div>
            <div className="sub-free-text">
              <h3 className="green-text">{trialLeft} Days Remaining</h3>
              <p>Enjoy your free trial</p>
            </div>
          </div>
        </div>

        {/* STEP 1 */}
        <div className="sub-step">
          <h2 className="sub-step-title"><span className="sub-step-number">1</span> Step 1 — Choose Your Country</h2>
          
          <div className="sub-plans-grid">
            {PLANS.map((plan, i) => (
              <div 
                key={i} 
                className={`sub-plan-card ${selectedPlan === i ? 'selected' : ''}`}
                style={{ '--theme-color': plan.color }}
                onClick={() => {
                  setSelectedPlan(i);
                  setSelectedMethod(null);
                }}
              >
                <div className="sub-plan-flag">
                  <img src={`https://flagcdn.com/w80/${plan.iso}.png`} alt={plan.region} />
                </div>
                <h3 className="sub-plan-region" style={{ color: plan.color }}>{plan.region}</h3>
                <div className="sub-plan-price">
                  <span className="price-val" style={{ color: plan.color }}>{plan.price}</span>
                  <span className="price-cur" style={{ color: plan.color }}>{plan.currency}</span>
                </div>
                <div className="sub-plan-duration">{plan.duration}</div>
                
                <ul className="sub-plan-features">
                  {FEATURES.map((f, fi) => (
                    <li key={fi}>
                      <span className="check-icon">✅</span> {f}
                    </li>
                  ))}
                </ul>
                
                <button className="sub-plan-btn" style={{ backgroundColor: plan.color }}>
                  Select Plan →
                </button>
              </div>
            ))}
          </div>

          <div 
            className={`sub-plan-card horizontal ${selectedPlan === 'western' ? 'selected' : ''}`}
            style={{ '--theme-color': WESTERN_PLAN.color }}
            onClick={() => {
              setSelectedPlan('western');
              setSelectedMethod(null);
            }}
          >
            <div className="sub-plan-horiz-left">
              <div className="sub-plan-globe">🌍</div>
            </div>
            <div className="sub-plan-horiz-center">
              <h3 className="sub-plan-region" style={{ color: WESTERN_PLAN.color }}>{WESTERN_PLAN.region}</h3>
              <div className="sub-plan-price">
                <span className="price-val" style={{ color: WESTERN_PLAN.color }}>{WESTERN_PLAN.price}</span>
                <span className="price-cur" style={{ color: WESTERN_PLAN.color }}>{WESTERN_PLAN.currency}</span>
              </div>
              <div className="sub-plan-duration">{WESTERN_PLAN.duration}</div>
            </div>
            <div className="sub-plan-horiz-features">
               <ul className="sub-plan-features double-col">
                  {FEATURES.map((f, fi) => (
                    <li key={fi}>
                      <span className="check-icon">✅</span> {f}
                    </li>
                  ))}
                </ul>
            </div>
            <div className="sub-plan-horiz-right">
              <button className="sub-plan-btn" style={{ backgroundColor: WESTERN_PLAN.color }}>
                Select Plan →
              </button>
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="sub-step">
          <h2 className="sub-step-title"><span className="sub-step-number">2</span> Step 2 — Choose Payment Method</h2>
          
          <div className="sub-methods-grid">
            {activeMethods.length > 0 ? (
              activeMethods.map((method, index) => {
                const methodId = method.name;
                const color = method.color || (method.type === 'bank' ? '#1565c0' : method.type === 'mobile' ? '#e53935' : '#4527a0');
                const icon = method.icon || (method.type === 'bank' ? '🏦' : method.type === 'mobile' ? '📱' : '💳');
                return (
                  <div 
                    key={`${methodId}-${index}`} 
                    className={`sub-method-box ${selectedMethod === methodId ? 'selected' : ''}`}
                    style={{ '--method-color': color }}
                    onClick={() => setSelectedMethod(methodId)}
                  >
                    {selectedMethod === methodId && <div className="sub-method-check">✓</div>}
                    <div className="sub-method-icon-circle" style={{ color, backgroundColor: color + "22" }}>
                      {icon}
                    </div>
                    <h4 className="sub-method-name" style={{ color }}>{method.name}</h4>
                    <div className="sub-method-details">
                      <span className="detail-value">{method.detail}</span>
                    </div>
                    <button 
                      className="sub-method-copy" 
                      style={{ backgroundColor: color }}
                      onClick={(e) => { e.stopPropagation(); handleCopy(method.detail, methodId); }}
                    >
                      📄 {copied === methodId ? "Copied" : "Copy Details"}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="sub-method-empty">
                {selectedPlan === null ? 'Select a country to see payment methods.' : 'No payment methods found for this country yet.'}
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT CONFIRMATION */}
        <div className="sub-confirmation-box">
          <div className="sub-conf-left">
            <div className="sub-conf-envelope">💌</div>
          </div>
          <div className="sub-conf-center">
            <h3 className="sub-conf-title">📧 Payment Confirmation</h3>
            <p className="sub-conf-desc">After payment, send payment proof to:</p>
            <div className="sub-email-input">
              <span className="email-text">thiyangkoang77@gmail.com</span>
              <button 
                className="email-copy-btn" 
                onClick={() => handleCopy("thiyangkoang77@gmail.com", "email")}
              >
                {copied === "email" ? "✅" : "📄"}
              </button>
            </div>
            <a 
              href={`mailto:thiyangkoang77@gmail.com?subject=Payment Confirmation - ${selectedPlanName || "App"}&body=Name: ${user?.name || ""}%0AEmail: ${user?.email || ""}%0APlan: ${selectedPlanName || ""} - ${activePlan?.price || ""}%0APayment Method: ${selectedMethodItem?.name || selectedMethod || ""}`}
              className="sub-conf-send-btn"
            >
              ✉️ Send Confirmation Email
            </a>
          </div>
          <div className="sub-conf-right">
            <h4 className="sub-conf-req-title">Include the following:</h4>
            <ul className="sub-conf-req-list">
              <li><span className="req-check">✓</span> Your Full Name</li>
              <li><span className="req-check">✓</span> Your Email Address</li>
              <li><span className="req-check">✓</span> Payment Screenshot</li>
              <li><span className="req-check">✓</span> Selected Country / Plan</li>
            </ul>
          </div>
        </div>

        <button className="sub-back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>
    </div>
  );
}
