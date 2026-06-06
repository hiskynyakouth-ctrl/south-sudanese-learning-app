import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useSubscription } from "../context/SubscriptionContext";
import { useProgress } from "../context/ProgressContext";
import {
  IconSun, IconMoon, IconAdmin, IconMenu, IconClose,
  IconHome, IconBook, IconFile, IconLogout, IconUser, IconSearch,
} from "./Icons";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { isTrialActive, trialDaysRemaining } = useSubscription();
  const { unreadCount } = useProgress();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");
  const close = () => setMenuOpen(false);
  const initial = (user?.name || "S")[0].toUpperCase();
  // Load avatar from localStorage
  const avatarKey = user ? `ss_avatar_${user.id || user.email}` : null;
  const avatarImg = avatarKey ? localStorage.getItem(avatarKey) : null;

  const trialActive = isTrialActive();
  const trialDays = trialActive ? trialDaysRemaining() : 0;
  const notifCount = isAuthenticated ? unreadCount() : 0;

  return (
    <header className="topbar">
      <div className="topbar-inner">

        <Link to="/" className="brand-mark" onClick={close}>
          <img src="https://flagcdn.com/w80/ss.png" alt="South Sudan Flag" className="brand-flag"
            onError={e => { e.target.onerror=null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/6d/Flag_of_South_Sudan.svg/80px-Flag_of_South_Sudan.svg.png"; }} />
          <span className="brand-text">
            <strong>South Sudan E-Learning</strong>
            <small>Secondary school study platform</small>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/textbooks" className="nav-link">Textbooks</NavLink>
          <NavLink to="/past-papers" className="nav-link">Past Papers</NavLink>
          {isAuthenticated && (
            <NavLink to="/chat" className="nav-link">🤖 AI Tutor</NavLink>
          )}
          {/* Subscribe — hidden for admin */}
          {!isAdmin && (
            <NavLink to="/subscription" className="nav-link nav-sub-link">
              ⭐ Subscribe
              {trialActive && trialDays <= 7 && (
                <span className="nav-trial-badge">{trialDays}d left</span>
              )}
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className="nav-link nav-admin-link">
              <IconAdmin size={16} /> Admin
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {/* Search */}
          <button className="nav-icon-btn" onClick={() => navigate("/search")} title="Search">
            <IconSearch size={16} />
          </button>

          <button className="theme-toggle" onClick={toggle} title="Toggle dark mode">
            {theme === "dark"
              ? <IconSun size={16} color="#f9a825" />
              : <IconMoon size={16} color="#5c6bc0" />}
          </button>

          {isAuthenticated ? (
            <div className="nav-user-group">
              {/* Notifications bell */}
              <button className="nav-icon-btn nav-notif-btn" onClick={() => navigate("/notifications")} title="Notifications">
                🔔
                {notifCount > 0 && <span className="nav-notif-badge">{notifCount > 9 ? "9+" : notifCount}</span>}
              </button>

              {/* Avatar — click to go to profile */}
              <button className="user-avatar-circle nav-avatar-btn" title={user?.name}
                onClick={() => navigate("/profile")}
                style={avatarImg ? { padding:0, overflow:"hidden" } : {}}>
                {avatarImg
                  ? <img src={avatarImg} alt={user?.name} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }} />
                  : initial}
              </button>
              <span className="user-role-badge">{isAdmin ? "Admin" : "Student"}</span>
              <button className="ghost-button nav-logout" onClick={logout}>
                <IconLogout size={14} style={{ marginRight:4 }} /> Logout
              </button>
            </div>
          ) : (
            <div className="nav-user-group">
              <Link to="/login" className="ghost-link">Login</Link>
              <Link to="/register" className="primary-link">Register</Link>
            </div>
          )}

          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <IconClose size={16} /> : <IconMenu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-menu">
          <NavLink to="/" className="mobile-nav-link" onClick={close}>
            <IconHome size={16} /> Home
          </NavLink>
          <NavLink to="/textbooks" className="mobile-nav-link" onClick={close}>
            <IconBook size={16} /> Textbooks
          </NavLink>
          <NavLink to="/past-papers" className="mobile-nav-link" onClick={close}>
            <IconFile size={16} /> Past Papers
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/chat" className="mobile-nav-link" onClick={close}>
              🤖 AI Tutor
            </NavLink>
          )}
          {/* Subscribe — hidden for admin */}
          {!isAdmin && (
            <NavLink to="/subscription" className="mobile-nav-link" onClick={close}>
              💳 Subscribe
              {trialActive && trialDays <= 7 && (
                <span className="nav-trial-badge" style={{ marginLeft: 8 }}>{trialDays}d left</span>
              )}
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className="mobile-nav-link" onClick={close}>
              <IconAdmin size={16} /> Admin
            </NavLink>
          )}
          <div className="mobile-menu-divider" />
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="mobile-nav-link" onClick={close}>
                <IconUser size={16} /> Profile
              </NavLink>
              <NavLink to="/notifications" className="mobile-nav-link" onClick={close}>
                🔔 Notifications {notifCount > 0 && <span className="nav-notif-badge" style={{marginLeft:6}}>{notifCount}</span>}
              </NavLink>
              <div className="mobile-user-row">
                <div className="user-avatar-circle" style={avatarImg ? { padding:0, overflow:"hidden" } : {}}>
                  {avatarImg
                    ? <img src={avatarImg} alt={user?.name} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"50%" }} />
                    : initial}
                </div>
                <span>{isAdmin ? "Admin" : "Student"}</span>
              </div>
              <button className="mobile-nav-link mobile-logout" onClick={() => { logout(); close(); }}>
                <IconLogout size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={close}>
                <IconUser size={16} /> Login
              </Link>
              <Link to="/register" className="mobile-nav-link" onClick={close}>
                <IconUser size={16} /> Register
              </Link>
            </>
          )}
          <button className="mobile-nav-link" onClick={() => { toggle(); close(); }}>
            {theme === "dark"
              ? <><IconSun size={16} /> Light Mode</>
              : <><IconMoon size={16} /> Dark Mode</>}
          </button>
        </nav>
      )}
    </header>
  );
}
