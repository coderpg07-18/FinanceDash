import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../utils/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ 
    password: "", 
    confirmPassword: "" 
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword)
      return setError("Passwords don't match!");
    setLoading(true);
    setError("");
    
    try {
      await authAPI.resetPassword(token, { password: form.password });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        <h1>Reset Password</h1>
        <p className="auth-subtitle">Enter your new password below.</p>
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => 
                setForm({ ...form, password: e.target.value })
              }
              required
              minLength={6}
              placeholder="Min 6 characters"
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
