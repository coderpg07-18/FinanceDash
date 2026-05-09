
// Signup

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "", 
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await signup(form);
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
        <h1>Create Account</h1>
        
        <p className="auth-subtitle">Start tracking your finances today</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
            type="text" 
            value={form.username} 
            onChange={(e) => setForm({ ...form, username: e.target.value })} 
            required 
            placeholder="johndoe" 
            minLength={3} 
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input 
            type="email" 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
            required 
            placeholder="you@example.com" 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
            type="password" 
            value={form.password} 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
            required 
            placeholder="Min 6 characters" 
            minLength={6} 
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}