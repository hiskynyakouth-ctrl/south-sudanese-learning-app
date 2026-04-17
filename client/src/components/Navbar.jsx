import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand-mark">
          <span className="brand-badge">SS</span>
          <span>
            <strong>South Sudan E-Learning</strong>
            <small>Secondary school study platform</small>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/textbooks" className="nav-link">Textbooks</NavLink>
          <NavLink to="/past-papers" className="nav-link">Past Papers</NavLink>
          <NavLink to="/chat" className="nav-link">AI Tutor</NavLink>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <div className="user-pill">
                <span>{user?.name || "Student"}</span>
                <small>{user?.email}</small>
              </div>
              <button type="button" className="ghost-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="ghost-link">Login</Link>
              <Link to="/register" className="primary-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
