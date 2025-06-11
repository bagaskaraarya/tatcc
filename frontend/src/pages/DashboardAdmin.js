import React, { useEffect, useState } from "react";
import ComplaintListAdmin from "../components/ComplaintListAdmin";
import { HiClipboardList, HiLogout } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Base_Url } from "../utils/utils";

function DashboardAdmin({ token, onLogout }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    terima: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setErrorStats(null);
      try {
        const res = await fetch(`${Base_Url}/rkakl/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Gagal mengambil data statistik");
        }
        const data = await res.json();

        console.log("data dari API stats:", data);

        const counts = {};
        data.forEach((item) => {
          counts[item.status.toLowerCase()] = Number(item.count);
        });

        console.log("counts:", counts);

        const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

        console.log("totalCount:", totalCount);
        console.log("terima:", counts["terima"]);

        setStats({
          total: totalCount,
          terima: counts["terima"] || 0,
        });
      } catch (error) {
        setErrorStats(error.message);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token
    onLogout(); // Update state/global context
    navigate("/login"); // Redirect ke login
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-blue-200 text-blue-900 flex items-center justify-between px-8 py-4 shadow-md">
        <div className="flex items-center space-x-3">
          <HiClipboardList size={28} />
          <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 text-blue-900 px-4 py-2 rounded-md shadow-md transition"
        >
          <HiLogout size={20} />
          Logout
        </button>
      </nav>

      <div className="flex flex-1 max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <main className="flex-1">
          {/* Welcome message */}
          <section className="mb-8 bg-blue-100 border border-blue-300 rounded-lg p-6">
            <h2 className="text-blue-900 text-xl font-semibold mb-2">
              Selamat Datang, Admin!
            </h2>
            <p className="text-blue-800">
              Kelola rencana kerja anggaran dengan mudah dan efektif melalui
              dashboard ini.
            </p>
          </section>

          {/* Statistik cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {loadingStats ? (
              <p className="text-center col-span-2 text-blue-700">
                Memuat data statistik...
              </p>
            ) : errorStats ? (
              <p className="text-center col-span-2 text-red-600">
                Error: {errorStats}
              </p>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                  <h2 className="text-gray-500 font-semibold mb-1">
                    Total Rkakl
                  </h2>
                  <p className="text-3xl font-extrabold text-blue-700">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                  <h2 className="text-gray-500 font-semibold mb-1">
                    Rkakl Terima
                  </h2>
                  <p className="text-3xl font-extrabold text-green-600">
                    {stats.terima}
                  </p>
                </div>
              </>
            )}
          </section>

          {/* List Pengaduan */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Daftar Pengaduan
            </h2>
            <ComplaintListAdmin token={token} />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-blue-200 text-blue-900 text-center py-4 mt-12">
        &copy; 2025 Sistem Pengaduan Mahasiswa. All rights reserved.
      </footer>
    </div>
  );
}

export default DashboardAdmin;
