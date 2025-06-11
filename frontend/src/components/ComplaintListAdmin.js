import React, { useEffect, useState, useCallback } from "react";
import {
  FaBook,
  FaBuilding,
  FaMoneyBillWave,
  FaFileAlt,
  FaEllipsisH,
} from "react-icons/fa";
import { Base_Url } from "../utils/utils";

function getKategoriBadge(kategori) {
  const lower = kategori?.toLowerCase() || "";

  switch (lower) {
    case "event konser":
      return {
        className: "bg-green-100 text-green-800",
        icon: <FaBook className="inline mr-1" />,
      };
    case "event lomba":
      return {
        className: "bg-blue-100 text-blue-800",
        icon: <FaBuilding className="inline mr-1" />,
      };
    case "program kerja divisi":
      return {
        className: "bg-yellow-100 text-yellow-800",
        icon: <FaMoneyBillWave className="inline mr-1" />,
      };
    case "event sosialisasi":
      return {
        className: "bg-purple-100 text-purple-800",
        icon: <FaFileAlt className="inline mr-1" />,
      };
    default:
      return {
        className: "bg-gray-100 text-gray-800",
        icon: <FaEllipsisH className="inline mr-1" />,
      };
  }
}

function ComplaintListAdmin({ token }) {
  const [rkaklList, setRkaklList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRkakl, setSelectedRkakl] = useState(null);

  const fetchRkakl = useCallback(async () => {
  setLoading(true);
  setError("");
  try {
    const res = await fetch(`${Base_Url}/rkakl`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!res.ok)
      throw new Error(data.message || "Gagal mengambil data aduan");

    setRkaklList(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [token]);

useEffect(() => {
  fetchRkakl();
}, [fetchRkakl]);


  async function handleStatusChange(id, newStatus) {
    try {
      const res = await fetch(`${Base_Url}/rkakl/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal mengupdate status");
      }

      setRkaklList((prev) =>
        prev.map((rkakl) =>
          rkakl.id === id ? { ...rkakl, status: newStatus } : rkakl
        )
      );
    } catch (err) {
      alert(`Error update status: ${err.message}`);
    }
  }

  async function handleDelete(id, rencana_kerja) {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus aduan "${rencana_kerja}"? Tindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${Base_Url}/rkakl/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus aduan");
      }

      setRkaklList((prev) => prev.filter((rkakl) => rkakl.id !== id));
      alert("Aduan berhasil dihapus");
    } catch (err) {
      alert(`Error menghapus aduan: ${err.message}`);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (rkaklList.length === 0) return <p>Belum ada rencana kerja anggaran.</p>;

  return (
    <>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  ID
                </th>
                <th className="border-b px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Rencana Kerja
                </th> 
                <th className="border-b px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Kategori
                </th>
                <th className="border-b px-5 py-3 text-center text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="border-b px-5 py-3 text-center text-sm font-semibold text-gray-700">
                  Ubah Status
                </th>
                <th className="border-b px-5 py-3 text-center text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {rkaklList.map((rkakl) => (
                <tr
                  key={rkakl.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="border-b px-5 py-3 text-gray-700 text-sm">
                    {rkakl.id}
                  </td>
                  <td className="border-b px-5 py-3 text-gray-800 text-sm">
                    {rkakl.rencana_kerja}
                  </td>
                  <td className="border-b px-5 py-3 text-gray-700 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        getKategoriBadge(rkakl.kategori).className
                      }`}
                    >
                      {getKategoriBadge(rkakl.kategori).icon}
                      {rkakl.kategori}
                    </span>
                  </td>
                  <td
                    className={`border-b px-5 py-3 text-center text-sm font-semibold ${
                      rkakl.status === "proses"
                        ? "text-blue-600"
                        : rkakl.status === "terima"
                        ? "text-green-600"
                        : rkakl.status === "tolak"
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                  >
                    {rkakl.status.charAt(0).toUpperCase() +
                      rkakl.status.slice(1)}
                  </td>
                  <td className="border-b px-5 py-3 text-center">
                    <select
                      value={rkakl.status}
                      onChange={(e) =>
                        handleStatusChange(rkakl.id, e.target.value)
                      }
                      className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                      <option value="proses">Proses</option>
                      <option value="terima">Terima</option>
                      <option value="tolak">Tolak</option>
                    </select>
                  </td>
                  <td className="border-b px-5 py-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => setSelectedRkakl(rkakl)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md shadow-md transition-colors duration-200 text-sm"
                        aria-label={`Lihat detail rencana kerja ${rkakl.rencana_kerja}`}
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => handleDelete(rkakl.id, rkakl.rencana_kerja)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-md transition-colors duration-200 text-sm"
                        aria-label={`Hapus rencana kerja ${rkakl.rencana_kerja}`}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedRkakl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedRkakl(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-lg p-8 relative text-gray-900"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
          >
            <button
              onClick={() => setSelectedRkakl(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none transition"
              aria-label="Tutup modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3
              id="modal-title"
              className="text-2xl font-semibold mb-4 border-b pb-2 border-gray-200"
            >
              {selectedRkakl.rencana_kerja}
            </h3>
            <p className="mb-2 text-sm text-gray-500">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  getKategoriBadge(selectedRkakl.kategori).className
                }`}
              >
                {getKategoriBadge(selectedRkakl.kategori).icon}
                {selectedRkakl.kategori || "-"}
              </span>
            </p>
            <div className="mb-6">
              <span className="font-semibold text-gray-700 block mb-1">
                Deskripsi:
              </span>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedRkakl.deskripsi}
              </p>
            </div><div className="mb-6">
              <span className="font-semibold text-gray-700 block mb-1">
                Link Anggaran:
              </span>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedRkakl.link_anggaran}
              </p>
            </div>
            <p className="mb-6 text-sm">
              <span className="font-semibold">Status: </span>
              <span
                className={`font-semibold ${
                  selectedRkakl.status === "proses"
                    ? "text-blue-600"
                    : selectedRkakl.status === "terima"
                    ? "text-green-600"
                    : selectedRkakl.status === "tolak"
                    ? "text-gray-500"
                    : "text-gray-600"
                }`}
              >
                {selectedRkakl.status.charAt(0).toUpperCase() +
                  selectedRkakl.status.slice(1)}
              </span>
            </p>

            <button
              onClick={() => setSelectedRkakl(null)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ComplaintListAdmin;
