import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../utils/utils";

function LoginPage({ setToken }) {
  const [nim, setnim] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah token sudah ada di localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      setToken(token); // Set token ke state global/parent
      // Redirect sesuai role
      if (role === "admin") navigate("/dashboard-admin");
      else if (role === "mahasiswa") navigate("/dashboard-mahasiswa");
      else navigate("/");
    }
  }, [navigate, setToken]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login to:", `${Base_Url}/auth/login`);
      console.log("Login data:", { nim, password: "***" });

      const res = await axios.post(`${Base_Url}/auth/login`, { nim, password });
      const { token, user } = res.data;

      if (!token || !user)
        throw new Error("Login gagal: Token atau user tidak valid");

      setToken(token);
      // Simpan token dan role ke localStorage supaya tetap login walau reload
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);

      if (user.role === "admin") navigate("/dashboard-admin");
      else if (user.role === "mahasiswa") navigate("/dashboard-mahasiswa");
      else navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      if (err.response?.status === 500) {
        setError(
          "Server sedang bermasalah. Silakan coba lagi nanti atau hubungi administrator."
        );
      } else {
        setError(err.response?.data?.message || err.message || "Gagal login");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-blue-100">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Login Pengguna
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="nim" className="block text-gray-600 mb-1">
              NIM
            </label>
            <input
              type="text"
              id="nim"
              value={nim}
              onChange={(e) => setnim(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Belum punya akun?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Daftar di sini
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
