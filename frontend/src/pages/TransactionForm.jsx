
// Transactions Form

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { transactionAPI, categoryAPI } from "../utils/api";

export default function TransactionForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    title: "", 
    amount: "", 
    type: "expense", 
    category: "", 
    date: new Date().toISOString().split("T")[0], 
    description: "" 
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    categoryAPI.getAll()
    .then(
      (data) => setCategories(data.categories)
    );

    if (isEdit) {
      transactionAPI.getById(id)
      .then((data) => {
        const tx = data.transaction;
        setForm({
          title: tx.title, 
          amount: tx.amount, 
          type: tx.type, 
          category: tx.category?._id || tx.category, 
          date: tx.date.split("T")[0], 
          description: tx.description || "" });
      });
    }
    
  }, [id]);

  const filteredCategories = categories.filter( (c) => c.type === form.type || c.type === "both" );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (isEdit) { 
        await transactionAPI.update(id, form); 
      }
      else { 
        await transactionAPI.create(form); 
      }
      navigate("/transactions");
    
    } catch (err) {
      setError(err.message);
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>
          {isEdit ? "Edit Transaction" : "➕ New Transaction"}
        </h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">

            <div className="form-group">
              <label>Type</label>
              <select 
              value={form.type} 
              onChange={(e) => setForm({ ...form, type: e.target.value, category: "" })}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
              value={form.category} 
              onChange={(e) => setForm({ ...form, category: e.target.value })} 
              required
              >
                <option value="">Select Category</option>

                {filteredCategories.map((c) => (
                  <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                ))}

              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input 
            type="text" 
            value={form.title} 
            onChange={
              (e) => setForm({ ...form, title: e.target.value }) 
            } 
            required placeholder="e.g. Monthly Salary" 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input 
              type="number" 
              value={form.amount} 
              onChange={(e) => setForm({ ...form, amount: e.target.value })} 
              required 
              min="0" step="0.01" 
              placeholder="0.00" 
              />
            </div>
            
            <div className="form-group">
              <label>Date</label>
              <input 
              type="date" 
              value={form.date} 
              onChange={(e) => setForm({ ...form, date: e.target.value })} 
              required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Description (optional)</label>
            <textarea 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
            placeholder="Add any notes..." rows={3} 
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" 
            onClick={() => navigate("/transactions")}
            >
              Cancel
            </button>
            
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update Transaction" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}