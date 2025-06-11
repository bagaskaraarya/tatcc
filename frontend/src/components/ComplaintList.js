import React, { useCallback, useEffect, useState } from "react";
import { Base_Url } from "../utils/utils";
import ComplaintDetail from "./ComplaintDetail";

function ComplaintList({ token, isAdmin }) {
  const [rkaklList, setRkaklList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRkakl, setSelectedRkakl] = useState(null);
  const [error, setError] = useState("");

  const fetchRkakl = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Untuk admin: ambil semua rkakl
      // Untuk mahasiswa: backend filter berdasarkan user yang login
      const url = isAdmin ? `${Base_Url}/rkakl` : `${Base_Url}/rkakl/user`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mengambil data rkakl");

      setRkaklList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, token]);

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
      // Update lokal state supaya UI langsung update
      setRkaklList((prev) =>
        prev.map((rkakl) =>
          rkakl.id === id ? { ...rkakl, status: newStatus } : rkakl
        )
      );
    } catch (err) {
      alert(`Error update status: ${err.message}`);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (rkaklList.length === 0) return <p></p>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">

      {selectedRkakl ? (
        <div>
          <button
            onClick={() => setSelectedRkakl(null)}
            className="mb-4 underline text-blue-600"
          >
            ← Kembali ke daftar
          </button>
          <ComplaintDetail
            token={token}
            rkaklId={selectedRkakl}
            isAdmin={isAdmin}
            onUpdated={fetchRkakl}
          />
        </div>
      ) : (
        <ul>
          {rkaklList.map((rkakl) => (
            <li
              key={rkakl.id}
              className={`border-b py-2 ${
                isAdmin ? "" : "cursor-pointer hover:bg-gray-50"
              }`}
              onClick={() => !isAdmin && setSelectedRkakl(rkakl.id)}
            >
              <strong>{rkakl.rencana_kerja}</strong> - <em>{rkakl.kategori}</em> -{" "}
              <span
                className={`font-semibold ${
                    rkakl.status === "proses"
                    ? "text-blue-600"
                    : rkakl.status === "selesai"
                    ? "text-green-600"
                    : rkakl.status === "batal"
                    ? "text-gray-600"
                    : rkakl.status === "tolak"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {rkakl.status.charAt(0).toUpperCase() + rkakl.status.slice(1)}
              </span>

              {/* Jika admin tampilkan select box untuk ubah status */}
              {isAdmin && (
                <select
                  value={rkakl.status}
                  onChange={(e) =>
                    handleStatusChange(rkakl.id, e.target.value)
                  }
                  className="ml-4 border rounded px-2 py-1"
                >
                  <option value="proses">Proses</option>
                  <option value="selesai">Selesai</option>
                  <option value="batal">Batal</option>
                  <option value="tolak">Tolak</option>
                </select>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ComplaintList;
