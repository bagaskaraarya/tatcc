import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardMahasiswa from "./pages/DashboardMahasiswa";
import ComplaintFormPage from "./components/ComplaintForm";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const handleLogin = (newToken, userRole) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", userRole);
    setToken(newToken);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage setToken={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute token={token}>
              <DashboardAdmin token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-mahasiswa"
          element={
            <ProtectedRoute token={token}>
              <DashboardMahasiswa token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaint-form"
          element={
            <ProtectedRoute token={token}>
              <ComplaintFormPage token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
