import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");
  const close = () => setMenuOpen(false);
  const initial = (user?.name || "S")[0].toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-inner">

        {/* Brand */}
        <Link to="/" className="brand-mark" onClick={close}>
          <img
            src="https://flagcdn.com/w40/ss.png"
            alt="South Sudan Flag"
            className="brand-flag"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/6d/Flag_of_South_Sudan.svg/40px-Flag_of_South_Sudan.svg.png";
            }}
          />
          <span className="brand-text">
            <strong>South Sudan E-Learning</strong>
            <small>Secondary school study platform</small>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/textbooks" className="nav-link">Textbooks</NavLink>
          <NavLink to="/past-papers" className="nav-link">Past Papers</NavLink>
          {isAdmin && <NavLink to="/admin" className="nav-link" style={{ color:"var(--accent)", fontWeight:700 }}>⚙️ Admin</NavLink>}
        </nav>

        {/* Right side */}
        <div className="nav-actions">
          {/* Theme toggle — always visible */}
          <button className="theme-toggle" onClick={toggle} title="Toggle dark mode">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Desktop: avatar + logout */}
          {isAuthenticated ? (
            <div className="nav-user-group">
              <div className="user-avatar-circle" title={user?.name}>{initial}</div>
              <span className="user-role-badge">{isAdmin ? "Admin" : "Student"}</span>
              <button className="ghost-button nav-logout" onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="nav-user-group">
              <Link to="/login" className="ghost-link">Login</Link>
              <Link to="/register" className="primary-link">Register</Link>
            </div>
          )}

          {/* Hamburger — mobile only */}
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="mobile-menu">
          <NavLink to="/" className="mobile-nav-link" onClick={close}>🏠 Home</NavLink>
          <NavLink to="/textbooks" className="mobile-nav-link" onClick={close}>📚 Textbooks</NavLink>
          <NavLink to="/past-papers" className="mobile-nav-link" onClick={close}>📄 Past Papers</NavLink>
          {isAdmin && <NavLink to="/admin" className="mobile-nav-link" onClick={close}>⚙️ Admin</NavLink>}
          <div className="mobile-menu-divider" />
          {isAuthenticated ? (
            <>
              <div className="mobile-user-row">
                <div className="user-avatar-circle">{initial}</div>
                <span>{isAdmin ? "Admin" : "Student"}</span>
              </div>
              <button className="mobile-nav-link mobile-logout" onClick={() => { logout(); close(); }}>🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link" onClick={close}>🔑 Login</Link>
              <Link to="/register" className="mobile-nav-link" onClick={close}>✏️ Register</Link>
            </>
          )}
          <button className="mobile-nav-link" onClick={() => { toggle(); close(); }}>
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </nav>
      )}
    </header>
  );
}
