import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { transactionAPI } from "../utils/api";
import { useToast } from "../context/ToastContext";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionAPI
      .getById(id)
      .then((data) => setTx(data.transaction))
      .catch((err) => {
        toast.error(err.message);
        navigate("/transactions");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await transactionAPI.delete(id);
      toast.success("Transaction deleted!");
      navigate("/transactions");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!tx) return null;

  return (
    <div className="form-container">
      <div className="form-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
          }}
        >
          <div>
            <span style={{ fontSize: "2.5rem" }}>
              {tx.category?.icon || "💳"}
            </span>
            <h1 style={{ marginTop: "0.5rem" }}>{tx.title}</h1>
          </div>
          
          <span
            className={`badge badge-${tx.type}`}
            style={{ fontSize: "1rem", padding: "0.4rem 1rem" }}
          >
            {tx.type}
          </span>
        </div>

        <div className="detail-grid">
          
          <div className="detail-item">
            <label>Amount</label>
            <p 
            className={`amount ${tx.type}`} 
            style={{ fontSize: "1.8rem" }}
            >
              {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
            </p>
          </div>
          
          <div className="detail-item">
            <label>Category</label>
            <p>
              {tx.category?.icon} {tx.category?.name}
            </p>
          </div>
          
          <div className="detail-item">
            <label>Date</label>
            <p>
              {new Date(tx.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          
          <div className="detail-item">
            <label>Added by</label>
            <p>{tx.owner?.username}</p>
          </div>
          
          {tx.isRecurring && (
            <div className="detail-item">
              <label>Recurring</label>
              <p>{tx.recurringInterval}</p>
            </div>
          )}

          {tx.description && (
            <div className="detail-item" style={{ gridColumn: "1/-1" }}>
              <label>Description</label>
              <p>{tx.description}</p>
            </div>
          )}

          {tx.tags?.length > 0 && (
            <div className="detail-item" style={{ gridColumn: "1/-1" }}>
              <label>Tags</label>
              
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {tx.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            
            </div>
          )}

          {tx.receipt?.url && (
            <div className="detail-item" style={{ gridColumn: "1/-1" }}>
              <label>Receipt</label>
              <img
                src={tx.receipt.url}
                alt="receipt"
                style={{
                  maxWidth: "300px",
                  borderRadius: "8px",
                  marginTop: "0.5rem",
                }}
              />
            </div>
          )}

          <div className="detail-item">
            <label>Created</label>
            <p>{new Date(tx.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: "2rem" }}>
          <Link
            to="/transactions"
            className="btn-secondary"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            ← Back
          </Link>

          <Link
            to={`/transactions/${id}/edit`}
            className="btn-primary"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Edit
          </Link>
          
          <button
            onClick={handleDelete}
            className="btn-sm btn-delete"
            style={{ padding: "0.75rem 1.5rem" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
