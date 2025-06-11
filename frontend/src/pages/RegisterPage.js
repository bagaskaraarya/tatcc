// src/pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_Url } from "../utils/utils";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    nim: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handler input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Validasi form sebelum submit
  const validateForm = () => {
    if (!form.nama.trim()) {
      setError("Nama lengkap wajib diisi");
      return false;
    }
    if (!/^\d{8,12}$/.test(form.nim)) {
      setError("NIM harus berupa 8-12 digit angka");
      return false;
    }
    if (!form.email.trim()) {
      setError("Email wajib diisi");
      return false;
    }
    // Validasi email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Format email tidak valid");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }
    return true;
  };

  // Handler submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${Base_Url}/auth/register`, form);

      if (res.data) {
        setSuccess("Registrasi berhasil. Mengarahkan ke login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal melakukan registrasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Daftar Akun</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-3 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama Lengkap"
            value={form.nama}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            name="nim"
            placeholder="NIM"
            value={form.nim}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Sudah punya akun?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Masuk di sini
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
