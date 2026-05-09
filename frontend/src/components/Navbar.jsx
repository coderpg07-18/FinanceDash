import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname.startsWith(path) ? "active" : "";

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">FinanceDash</Link>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <Link
              to="/dashboard"
              className={isActive("/dashboard")}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              to="/transactions"
              className={isActive("/transactions")}
              onClick={() => setMenuOpen(false)}
            >
              Transactions
            </Link>

            <Link
              to="/budgets"
              className={isActive("/budgets")}
              onClick={() => setMenuOpen(false)}
            >
              Budgets
            </Link>

            <Link
              to="/reports"
              className={isActive("/reports")}
              onClick={() => setMenuOpen(false)}
            >
              Reports
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={isActive("/admin")}
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            <Link
              to="/profile"
              className={isActive("/profile")}
              onClick={() => setMenuOpen(false)}
            >

              {user.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt="avatar"
                  className="nav-avatar"
                />
              ) : (
                `${user.username}`
              )}
            </Link>

            <button onClick={toggle} className="theme-toggle">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={toggle} className="theme-toggle">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            
            <Link
              to="/signup"
              className="btn-signup"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
