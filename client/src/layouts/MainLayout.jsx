import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import SubscriptionGuard from "../components/SubscriptionGuard";
import { useSubscription } from "../context/SubscriptionContext";
import { Link } from "react-router-dom";

// Pages that should NOT be blocked by the subscription guard
const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/subscription"];

function TrialBanner() {
  const { isTrialActive, trialDaysRemaining } = useSubscription();
  if (!isTrialActive()) return null;
  const days = trialDaysRemaining();
  return (
    <div className="sub-trial-countdown-banner">
      🎓 Free trial: <strong>{days} day{days !== 1 ? "s" : ""} remaining</strong>
      {" — "}
      <Link to="/subscription" className="sub-trial-countdown-link">
        Subscribe to continue →
      </Link>
    </div>
  );
}

export default function MainLayout({ children }) {
  const location = useLocation();
  const isPublic = PUBLIC_PATHS.includes(location.pathname);

  return (
    <div className="app-shell">
      <Navbar />
      <TrialBanner />
      <main className="page-shell">
        {isPublic ? children : <SubscriptionGuard>{children}</SubscriptionGuard>}
      </main>
    </div>
  );
}
