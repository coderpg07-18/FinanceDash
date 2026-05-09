
// Login

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ 
    email: "", 
    password: "" 
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to your financial dashboard</p>
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => 
                setForm({ ...form, email: e.target.value })
              }
              required
              placeholder="you@example.com"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => 
                setForm({ ...form, password: e.target.value })
              }
              required
              placeholder="••••••••"
            />
          </div>
          
          {}
          <div style={{ textAlign: "right", marginBottom: "1rem" }}>
            <Link
              to="/forgot-password"
              style={{ color: "var(--primary)", fontSize: "0.85rem" }}
            >
              Forgot Password?
            </Link>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
