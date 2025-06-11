import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineLogout, HiPlus } from "react-icons/hi";
import { jwtDecode } from "jwt-decode";
import ComplaintListMahasiswa from "../components/ComplaintList";
import { Base_Url } from "../utils/utils";

function DashboardMahasiswa({ token, onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    diproses: 0,
    terima: 0,
    tolak: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);
  const [listRkakl, setListRkakl] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token tidak valid", err);
        handleLogout(); // token rusak → logout
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      setLoadingStats(true);
      setErrorStats(null);
      try {
        const res = await fetch(`${Base_Url}/rkakl/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Gagal mengambil data statistik");
        }
        const data = await res.json();

        const counts = {};
        data.forEach((item) => {
          counts[item.status.toLowerCase()] = Number(item.count);
        });

        const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

        setStats({
          total: totalCount,
          diproses: counts["proses"] || 0,
          terima: counts["terima"] || 0,
          tolak: counts["tolak"] || 0,
        });
      } catch (error) {
        setErrorStats(error.message);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchList = async () => {
      setLoadingList(true);
      setErrorList(null);
      try {
        const res = await fetch(`${Base_Url}/rkakl/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Gagal mengambil daftar rkakl");
        }
        const data = await res.json();
        setListRkakl(data);
      } catch (error) {
        setErrorList(error.message);
      } finally {
        setLoadingList(false);
      }
    };

    fetchList();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token dari localStorage
    onLogout(); // Update state global atau context
    navigate("/login"); // Redirect ke halaman login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-8 space-y-6 border border-gray-200">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Dashboard Mahasiswa
          </h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <HiOutlineLogout size={20} />
            Logout
          </button>
        </header>

        {/* WELCOME */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4">
          <p className="text-lg text-blue-800">
            Selamat datang kembali,{" "}
            <span className="font-semibold">{user?.nama || "Mahasiswa"}</span>!
            👋
          </p>
          <p className="text-sm text-blue-700">
            Berikut ringkasan aktivitas rencana kerjamu.
          </p>
        </div>

        {/* STATISTIK */}
        {!loadingStats && !errorStats && (
          <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Total Rencana Kerja</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Sedang Diproses</p>
              <p className="text-3xl font-bold text-yellow-500">
                {stats.diproses}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Terima</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.terima}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">Tolak</p>
              <p className="text-3xl font-bold text-red-500">{stats.tolak}</p>
            </div>
          </section>
        )}
        {loadingStats && <p>Loading statistik...</p>}
        {errorStats && <p className="text-red-500">Error: {errorStats}</p>}

        {/* LIST RENCANA KERJA */}
        <main
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-inner space-y-4 max-h-[400px] overflow-y-auto
          scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
        >
          <h2 className="text-2xl font-semibold text-gray-900 border-b pb-2 border-gray-200">
            Daftar Rencana Kerja Anda
          </h2>

          {loadingList && <p>Loading daftar rencana kerja...</p>}
          {errorList && <p className="text-red-500">Error: {errorList}</p>}
          {!loadingList && !errorList && listRkakl.length === 0 && (
            <p className="text-gray-600">Belum ada rencana kerja.</p>
          )}

          <ComplaintListMahasiswa complaints={listRkakl} token={token} />
        </main>

        {/* FOOTER */}
        <footer className="text-right pt-4">
          <button
            onClick={() => navigate("/complaint-form")}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <HiPlus size={22} />
            Buat Rencana Kerja Baru
          </button>
        </footer>
      </div>
    </div>
  );
}

export default DashboardMahasiswa;
