import { useState, useEffect } from "react";
import { budgetAPI, categoryAPI } from "../utils/api";
import { useToast } from "../context/ToastContext";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  
  const toast = useToast();
  const now = new Date();

  const fetchBudgets = () => {
    budgetAPI
      .getAll({ month: form.month, year: form.year })
      .then((data) => setBudgets(data.budgets))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((data) =>
        setCategories(
          
          data.categories.filter(
            (c) => c.type === "expense" || c.type === "both",
          ),
        
        ),
      );
    
    fetchBudgets();
  }, [form.month, form.year]);


  const handleCreate = async (e) => {
    e.preventDefault();
    
    try {
      await budgetAPI.create(form);
      toast.success("Budget created!");
    
      setShowForm(false);
      setForm({ ...form, category: "", amount: "" });
    
      fetchBudgets();
    
    } catch (err) {
      toast.error(err.message);
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    
    try {
      await budgetAPI.delete(id);
      toast.success("Budget deleted!");
    
      fetchBudgets();
    
    } catch (err) {
      toast.error(err.message);
    }
  };


  const getStatusColor = (pct) =>
    pct >= 100 ? "#ef4444" : pct >= 80 ? "#f97316" : "#22c55e";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="budgets-page">
      <div className="page-header">
        <h1>Budget Manager</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
          style={{ width: "auto" }}
        >
          {showForm ? "✕ Cancel" : "+ New Budget"}
        </button>
      </div>

      {/* Month Selector */}
      <div className="filter-bar">
        <select
          value={form.month}
          onChange={(e) => 
            setForm({ ...form, month: Number(e.target.value) })
          }
        >
          {months.map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        
        <select
          value={form.year}
          onChange={(e) => 
            setForm({ ...form, year: Number(e.target.value) })
          }
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="form-card" style={{ marginBottom: "1.5rem" }}>
          <h3>Create Budget</h3>
          
          <form onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.icon} {c.name}
                    </option>
                  ))}

                </select>
              </div>
              
              <div className="form-group">
                <label>Budget Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => 
                    setForm({ ...form, amount: e.target.value })
                  }
                  required
                  min="1"
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
            
            <button type="submit" className="btn-primary">
              Create Budget
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : budgets.length === 0 ? (
        <div className="empty-state">
          <p>
            No budgets set for {months[form.month - 1]} {form.year}
          </p>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
            style={{ width: "auto", marginTop: "1rem" }}
          >
            Create your first budget
          </button>
        </div>
      ) : (
        <div className="budgets-list">
          
          {budgets.map((b) => {
            
            const pct =
              b.amount > 0 ? Math.min((b.spent / b.amount) * 100, 100) : 0;
            const color = getStatusColor(pct);
            
            return (
              <div key={b._id} className="budget-card">
                <div className="budget-header">
                  <span className="budget-cat">
                    {b.category?.icon} {b.category?.name}
                  </span>
                  
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="btn-sm btn-delete"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="budget-amounts">
                  <span>
                    Spent:{" "}
                    <strong className="expense">
                      ₹{b.spent.toLocaleString()}
                    </strong>
                  </span>
                  
                  <span>
                    Budget: <strong>₹{b.amount.toLocaleString()}</strong>
                  </span>
                  
                  <span>
                    Left:{" "}
                    <strong style={{ color }}>
                      ₹{Math.max(b.amount - b.spent, 0).toLocaleString()}
                    </strong>
                  </span>
                </div>
                
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                    fontSize: "0.85rem",
                  }}
                >
                  <span style={{ color }}>
                    {pct.toFixed(1)}% used
                  </span>
                  
                  {pct >= 100 && (
                    <span style={{ color: "#ef4444", fontWeight: 600 }}>
                      Budget exceeded!
                    </span>
                  )}

                  {pct >= 80 && pct < 100 && (
                    <span style={{ color: "#f97316", fontWeight: 600 }}>
                      Almost at limit!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
