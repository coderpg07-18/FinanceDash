import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { transactionAPI } from "../utils/api";
import { useToast } from "../context/ToastContext";


export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState({
    type: "",
    search: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();


  const fetchTransactions = useCallback(
    async (pageNum = 1, append = false) => {

      append ? setLoadingMore(true) : setLoading(true);
      
      const params = { page: pageNum, limit: 10 };
      if (filter.type) params.type = filter.type;
      if (filter.search) params.search = filter.search;
      if (filter.startDate) params.startDate = filter.startDate;
      if (filter.endDate) params.endDate = filter.endDate;

      try {
        const data = await transactionAPI.getAll(params);  
        
        setTransactions((prev) =>
          append ? [...prev, ...data.transactions] : data.transactions,
        );
        setHasMore(data.pagination.hasMore);

      } catch (err) {
        toast.error(err.message);

      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [filter],
  );


  useEffect( () => {
    setPage(1);
    fetchTransactions(1, false);
  },
  [filter]
  );


  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchTransactions(next, true);
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await transactionAPI.delete(id);
      toast.success("Transaction deleted!");
      fetchTransactions(1, false);
      setPage(1);

    } catch (err) {
      toast.error(err.message);
    }
  };


  const handleExport = async () => {
    try {
      const params = {};
      if (filter.type) params.type = filter.type;
      if (filter.startDate) params.startDate = filter.startDate;
      if (filter.endDate) params.endDate = filter.endDate;
  
      const res = await transactionAPI.exportCSV(params);
  
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      a.click();
  
      URL.revokeObjectURL(url);
      toast.success("CSV exported!");
  
    } catch (err) {
      toast.error("Export failed");
    }
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>All Transactions</h1>
        <div className="header-actions">
          <button
            onClick={handleExport}
            className="btn-secondary"
            style={{ width: "auto" }}
          >
            ⬇ Export CSV
          </button>

          <Link
            to="/transactions/new"
            className="btn-primary"
            style={{
              width: "auto",
              textDecoration: "none",
              padding: "0.75rem 1.5rem",
            }}
          >
            + New
          </Link>

        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search transactions..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="search-input"
        />

        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <input
          type="date"
          value={filter.startDate}
          onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
        />
        
        <input
          type="date"
          value={filter.endDate}
          onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
        />
        
        {(filter.type ||
          filter.search ||
          filter.startDate ||
          filter.endDate) && (
          <button
            onClick={() =>
              setFilter({ type: "", search: "", startDate: "", endDate: "" })
            }
            className="btn-sm"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found.</p>

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
            Add Transaction
          </Link>
        
        </div>
      ) : (
        <>
          
          <div className="tx-table">
            <div className="tx-table-header">
              <span>Title</span>
              <span>Category</span>
              <span>Date</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Actions</span>
            </div>

            {transactions.map((tx) => (
              <div key={tx._id} className="tx-row">
                
                <span>
                  {tx.category?.icon} {tx.title}
                </span>
                
                <span>{tx.category?.name}</span>
                
                <span>{new Date(tx.date).toLocaleDateString()}</span>
                
                <span className={`badge badge-${tx.type}`}>{tx.type}</span>
                
                <span className={`amount ${tx.type}`}>
                  {tx.type === "income" ? "+" : "-"}₹
                  {tx.amount.toLocaleString()}
                </span>
                
                <span className="actions">
                  <button
                    onClick={() => navigate(`/transactions/${tx._id}`)}
                    className="btn-sm"
                  >
                    View
                  </button>
                  
                  <button
                    onClick={() => navigate(`/transactions/${tx._id}/edit`)}
                    className="btn-sm btn-edit"
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDelete(tx._id)}
                    className="btn-sm btn-delete"
                  >
                    Delete
                  </button>
                </span>
              
              </div>
            ))}
          </div>

          {hasMore && (
            <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
              
              <button
                onClick={loadMore}
                className="btn-secondary"
                style={{ width: "auto" }}
                disabled={loadingMore}
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            
            </div>
          )}
        </>
      )}
    </div>
  );
}
