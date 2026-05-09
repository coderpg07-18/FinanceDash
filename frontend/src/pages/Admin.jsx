
// Admin => Admin-only user management

import { useState, useEffect } from "react";
import { authAPI } from "../utils/api";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getAllUsers()
      .then((data) => setUsers(data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="admin-page">
      <h1>Admin Panel - User Management</h1>
      <p className="admin-subtitle">Total users: {users.length}</p>
      
      <div className="user-table">
        <div className="user-table-header">
          <span>Username</span>
          <span>Email</span>
          <span>Role</span>
          <span>Income</span>
          <span>Expense</span>
          <span>Balance</span>
          <span>Joined</span>
        </div>
        
        {users.map((u) => (
          <div key={u._id} className="user-row">
            <span>{u.username}</span>
            <span>{u.email}</span>
    
            <span className={`badge badge-${u.role}`}>
              {u.role}
            </span>
            
            <span className="amount income">
              ₹{u.totalIncome?.toLocaleString() || 0}
            </span>
            
            <span className="amount expense">
              ₹{u.totalExpense?.toLocaleString() || 0}
            </span>
            
            <span className={`amount ${(u.totalIncome - u.totalExpense) >= 0 ? "income" : "expense"}`}>
              ₹{((u.totalIncome || 0) - (u.totalExpense || 0)).toLocaleString()}
            </span>
            
            <span>{new Date(u.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}