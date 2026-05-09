import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { transactionAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    transactionCount: 0,
  });
  const [recentTx, setRecentTx] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    Promise.all([
      transactionAPI.getSummary({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      }),
      
      transactionAPI.getAll({ limit: 5 }),
      
      transactionAPI.getMonthlyReport({ year: now.getFullYear() }),
      
      transactionAPI.getCategoryReport({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        type: "expense",
      }),
    ])
      .then(([sumData, txData, monthData, catData]) => {
        setSummary(sumData.summary);
        setRecentTx(txData.transactions);
        setMonthlyData(monthData.data);
        setCategoryData(catData.data.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;


  const maxMonthly = Math.max(
    ...monthlyData.map((m) => Math.max(m.income, m.expense)),
    1,
  );
  const totalCatSpend = categoryData.reduce((s, c) => s + c.total, 0);


  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.username}!</h1>
          
          <p className="dashboard-date">
            {now.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        
        <div className="header-actions">
          {isAdmin && <span className="admin-badge">🛡️ Admin</span>}
          <Link
            to="/transactions/new"
            className="btn-primary"
            style={{
              width: "auto",
              textDecoration: "none",
              padding: "0.6rem 1.2rem",
            }}
          >
            + Add Transaction
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        {[
          {
            label: "Total Income",
            value: summary.income,
            cls: "income",
          },
          {
            label: "Total Expense",
            value: summary.expense,
            cls: "expense",
          },
          {
            label: "Net Balance",
            value: summary.balance,
            cls: summary.balance >= 0 ? "income" : "expense",
          },
          {
            label: "Transactions",
            value: summary.transactionCount,
            cls: "",
            plain: true,
          },
        ].map((card) => (
          <div key={card.label} className={`card card-${card.cls}`}>
            
            <div className="card-icon">{card.icon}</div>
            
            <div className="card-body">
              <h3>{card.label}</h3>

              <p className={`amount ${card.cls}`}>
                {card.plain ? card.value : `₹${Number(card.value).toLocaleString()}`}
              </p>
            </div>
          
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Monthly Bar Chart */}
        <div className="chart-card">
          
          <h2>Monthly Overview ({now.getFullYear()})</h2>
          <div className="bar-chart">
            {monthlyData.map((m) => (
              
              <div key={m.month} className="bar-group">
                <div className="bars">
                  <div
                    className="bar bar-income"
                    style={{ height: `${(m.income / maxMonthly) * 100}%` }}
                    title={`₹${m.income.toLocaleString()}`}
                  />
                  
                  <div
                    className="bar bar-expense"
                    style={{ height: `${(m.expense / maxMonthly) * 100}%` }}
                    title={`₹${m.expense.toLocaleString()}`}
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
        </div>

        {/* Category Pie Chart */}
        <div className="chart-card">
          <h2>Top Expenses This Month</h2>
          
          {categoryData.length === 0 ? (
            <div className="empty-state" style={{ padding: "2rem" }}>
              No expense data yet
            </div>
          ) : (
            <>
              <div className="pie-chart">
                {(() => {
                  let offset = 0;
                  
                  return categoryData.map((c, i) => {
                    const pct = (c.total / totalCatSpend) * 100;
                    const slice = (
                      <div key={i} className="pie-slice-row">
                        <div
                          className="pie-color"
                          style={{ background: c.category?.color || "#6366f1" }}
                        />
                        
                        <div className="pie-info">
                          <span>
                            {c.category?.icon} {c.category?.name}
                          </span>
                          
                          <span className="pie-amount">
                            ₹{c.total.toLocaleString()}{" "}
                            <small>({pct.toFixed(1)}%)</small>
                          </span>
                        </div>
                        
                        <div className="pie-bar-wrap">
                          <div
                            className="pie-bar-fill"
                            style={{
                              width: `${pct}%`,
                              background: c.category?.color || "#6366f1",
                            }}
                          />
                        </div>
                      </div>
                    );
                    
                    offset += pct;
                    return slice;
                  });
                })()}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-section">
        <div className="section-header">
          <h2>Recent Transactions</h2>
          
          <Link to="/transactions" className="view-all">
            View All →
          </Link>
        </div>
        
        {recentTx.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet.</p>
            <Link
              to="/transactions/new"
              className="btn-primary"
              style={{
                width: "auto",
                display: "inline-block",
                marginTop: "1rem",
                textDecoration: "none",
                padding: "0.75rem 1.5rem",
              }}
            >
              + Add your first transaction
            </Link>
          </div>
        ) : (
          <div className="tx-list">
            {recentTx.map((tx) => (
              <div key={tx._id} className="tx-item">
                <span className="tx-icon">{tx.category?.icon || "💳"}</span>
                <div className="tx-info">
                  <strong>{tx.title}</strong>
                  <small>
                    {tx.category?.name} ·{" "}
                    {new Date(tx.date).toLocaleDateString()}
                  </small>
                </div>
                
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === "income" ? "+" : "-"}₹
                  {tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
