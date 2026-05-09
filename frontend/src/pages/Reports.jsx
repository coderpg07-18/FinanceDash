import { useState, useEffect } from "react";
import { transactionAPI } from "../utils/api";

export default function Reports() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [catType, setCatType] = useState("expense");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    Promise.all([
      transactionAPI.getMonthlyReport({ year }),
      transactionAPI.getCategoryReport({ month, year, type: catType }),
    ])
      .then(([mData, cData]) => {
        setMonthlyData(mData.data);
        setCategoryData(cData.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year, month, catType]);

  const maxVal = Math.max(
    ...monthlyData.map((m) => 
      Math.max(m.income, m.expense)
    ),
    1,
  );

  const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
  const totalExpense = monthlyData.reduce((s, m) => s + m.expense, 0);
  const totalCat = categoryData.reduce((s, c) => s + c.total, 0);

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="reports-page">
      <h1>Reports</h1>

      {/* Year Overview */}
      <div className="report-card">
        <div className="report-header">
          
          <h2>Year Overview</h2>
          <div className="year-selector">
            
            <button onClick={() => setYear((y) => y - 1)} className="btn-sm">
              ◀
            </button>
            
            <span style={{ padding: "0 1rem", fontWeight: "700" }}>{year}</span>
            
            <button onClick={() => setYear((y) => y + 1)} className="btn-sm">
              ▶
            </button>
          </div>
        </div>

        <div className="year-summary">
          
          <div className="year-stat">
            <span>Total Income</span>
            <strong className="income">₹{totalIncome.toLocaleString()}</strong>
          </div>
          
          <div className="year-stat">
            <span>Total Expense</span>
            <strong className="expense">
              ₹{totalExpense.toLocaleString()}
            </strong>
          </div>
          
          <div className="year-stat">
            <span>Net Savings</span>
            <strong
              className={totalIncome - totalExpense >= 0 ? "income" : "expense"}
            >
              ₹{(totalIncome - totalExpense).toLocaleString()}
            </strong>
          </div>
          
          <div className="year-stat">
            <span>Savings Rate</span>
            <strong className="income">
              {totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1,): 0}
              %
            </strong>
          </div>
        
        </div>

        {/* Monthly Bar Chart */}
        <div className="bar-chart large">
          {monthlyData.map((m) => (
            <div key={m.month} className="bar-group">
              
              <div className="bars">
                <div
                  className="bar bar-income"
                  style={{ height: `${(m.income / maxVal) * 100}%` }}
                  title={`Income: ₹${m.income.toLocaleString()}`}
                />
                
                <div
                  className="bar bar-expense"
                  style={{ height: `${(m.expense / maxVal) * 100}%` }}
                  title={`Expense: ₹${m.expense.toLocaleString()}`}
                />
              </div>
              
              <span className="bar-label">{m.name}</span>
            </div>
          ))}
        </div>
        
        <div className="chart-legend">
          <span>
            <i className="dot dot-income" />
            Income
          </span>
          
          <span>
            <i className="dot dot-expense" />
            Expense
          </span>
        </div>

        {/* Monthly Table */}
        <div className="monthly-table">
          <div className="monthly-table-header">
            <span>Month</span>
            <span>Income</span>
            <span>Expense</span>
            <span>Balance</span>
          </div>
          
          {monthlyData.map((m) => (
            <div key={m.month} className="monthly-table-row">
              <span>{m.name}</span>
              <span className="income">₹{m.income.toLocaleString()}</span>
              <span className="expense">₹{m.expense.toLocaleString()}</span>
              <span className={m.balance >= 0 ? "income" : "expense"}>
                ₹{m.balance.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      
      </div>

      {/* Category Breakdown */}
      <div className="report-card">
        <div className="report-header">
          
          <h2>Category Breakdown</h2>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {[
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
              ].map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            
            <select
              value={catType}
              onChange={(e) => setCatType(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        
        </div>

        {categoryData.length === 0 ? (
          <div className="empty-state" style={{ padding: "2rem" }}>
            No data for this period
          </div>
        ) : (
          <div className="category-breakdown">
            
            {categoryData.map((c, i) => {
              const pct =
                totalCat > 0 ? ((c.total / totalCat) * 100).toFixed(1) : 0;
              return (
                <div key={i} className="cat-row">
                  
                  <div className="cat-row-top">
                    <span>
                      {c.category?.icon} {c.category?.name}
                    </span>
                    <span className="expense">
                      ₹{c.total.toLocaleString()} <small>({pct}%)</small>
                    </span>
                  </div>
                  
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: c.category?.color || "#6366f1",
                      }}
                    />
                  </div>
                
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
