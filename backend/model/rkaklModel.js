// models/rkaklMahasiswaModel.js
import pgPool from "../config/postgresql.js";

// Ambil semua rkakl
export const getAllRkakl = async () => {
  const result = await pgPool.query(
    "SELECT * FROM rkakl ORDER BY tanggal_dibuat DESC"
  );
  return result.rows;
};

// Ambil rkakl berdasarkan ID
export const getRkaklById = async (id) => {
  const result = await pgPool.query(
    "SELECT * FROM rkakl WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

// Buat rkakl baru
export const createNewRkakl = async ({
  user_id,
  rencana_kerja,
  deskripsi,
  status,
  kategori,
  link_anggaran
}) => {
  const result = await pgPool.query(
    `INSERT INTO rkakl (user_id, rencana_kerja, deskripsi, status, tanggal_dibuat, tanggal_diperbarui, kategori, link_anggaran) 
     VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, $6) 
     RETURNING *`,
    [user_id, rencana_kerja, deskripsi, status, kategori, link_anggaran]
  );
  return result.rows[0];
};

// Update rkakl berdasarkan ID
export const updateRkaklById = async (id, { rencana_kerja, deskripsi, kategori, status, link_anggaran }) => {
  const result = await pgPool.query(
    `UPDATE rkakl
     SET rencana_kerja = $1,
         deskripsi = $2,
         status = $3,
         tanggal_diperbarui = NOW(),
         kategori = $4,
         link_anggaran = $5
     WHERE id = $6
     RETURNING *
     `,
    [rencana_kerja, deskripsi, status, kategori, link_anggaran, id]
  );
  return result.rows[0];
};

// Hapus rkakl berdasarkan ID
export const deleteRkakl = async (id) => {
  const result = await pgPool.query(
    "DELETE FROM rkakl WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export const countByStatus = async (userId) => {
  const result = await pgPool.query(
    `SELECT status, COUNT(*) AS count
     FROM rkakl
     WHERE user_id = $1
     GROUP BY status`,
    [userId]
  );
  return result.rows; // [{status: 'proses', count: '5'}, ...]
};

export const countByStatusAll = async () => {
  const result = await pgPool.query(
    `SELECT status, COUNT(*) AS count
     FROM rkakl
     GROUP BY status`
  );
  return result.rows;
};

export const getRkaklByUser = async (userId) => {
  const result = await pgPool.query(
    `SELECT * FROM rkakl
     WHERE user_id = $1
     ORDER BY tanggal_dibuat DESC`,
    [userId]
  );
  return result.rows;
};
