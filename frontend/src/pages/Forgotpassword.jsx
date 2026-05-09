import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");
    
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        
        {sent ? (
          <>
            <p style={{ color: "#22c55e", margin: "1rem 0" }}>
              ✅ Reset email sent! Check your inbox.
            </p>
            
            <Link
              to="/login"
              className="btn-primary"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Back to Login
            </Link>
          </>
        ) : (
          <>
            <p className="auth-subtitle">
              Enter your email and we'll send a reset link.
            </p>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
              
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            
            <p className="auth-footer">
              <Link to="/login">← Back to Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
