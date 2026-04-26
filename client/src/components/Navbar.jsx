import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  IconSun, IconMoon, IconAdmin, IconMenu, IconClose,
  IconHome, IconBook, IconFile, IconLogout, IconUser,
} from "./Icons";

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
          {isAdmin && (
            <NavLink to="/admin" className="nav-link nav-admin-link">
              <IconAdmin size={16} /> Admin
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggle} title="Toggle dark mode">
            {theme === "dark"
              ? <IconSun size={16} color="#f9a825" />
              : <IconMoon size={16} color="#5c6bc0" />}
          </button>

          {isAuthenticated ? (
            <div className="nav-user-group">
              <div className="user-avatar-circle" title={user?.name}>{initial}</div>
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
          {isAdmin && (
            <NavLink to="/admin" className="mobile-nav-link" onClick={close}>
              <IconAdmin size={16} /> Admin
            </NavLink>
          )}
          <div className="mobile-menu-divider" />
          {isAuthenticated ? (
            <>
              <div className="mobile-user-row">
                <div className="user-avatar-circle">{initial}</div>
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
