
// AuthContext

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      authAPI.getProfile()
        .then((data) => setUser(data.user))
        .catch(() => { localStorage.removeItem("token"); setUser(null); })
        .finally(() => setLoading(false));
    
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    
    localStorage.setItem("token", data.token);
    
    setUser(data.user);
    
    return data;
  };

  const signup = async (credentials) => {
    const data = await authAPI.signup(credentials);
    
    localStorage.setItem("token", data.token);
    
    setUser(data.user);
    
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  
  return ctx;
};