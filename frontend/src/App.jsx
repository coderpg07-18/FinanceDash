//  App.jsx - React Router setup

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import TransactionForm from "./pages/TransactionForm.jsx";
import TransactionDetail from "./pages/TransactionDetail.jsx";
import Budgets from "./pages/Budgets.jsx";
import Reports from "./pages/Reports.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";
import "./styles/main.css";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions/new"
                  element={
                    <ProtectedRoute>
                      <TransactionForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions/:id"
                  element={
                    <ProtectedRoute>
                      <TransactionDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions/:id/edit"
                  element={
                    <ProtectedRoute>
                      <TransactionForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/budgets"
                  element={
                    <ProtectedRoute>
                      <Budgets />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
