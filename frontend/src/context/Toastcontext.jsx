import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  }, []);

  const success = (msg) => addToast(msg, "success");
  const error = (msg) => addToast(msg, "error");
  const info = (msg) => addToast(msg, "info");

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      
      {children}
      <div className="toast-container">
        
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            
            <span>
              {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
            </span>
            
            {t.message}
          </div>
        ))}
      </div>
      
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
};
