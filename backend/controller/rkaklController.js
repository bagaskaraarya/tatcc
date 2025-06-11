import * as RkaklModel from "../model/rkaklModel.js"; // sesuaikan nama model
import User from "../model/userModel.js";

export const getRkakl = async (req, res) => {
  try {
    const rkakl = await RkaklModel.getAllRkakl();
    res.json(rkakl);
  } catch (error) {
    console.error("Error getRkakl:", error);
    res.status(500).json({ message: "Gagal mengambil data rkakl" });
  }
};

export const getRkaklByID = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Ambil rkakl dari PostgreSQL
    const rkakl = await RkaklModel.getRkaklById(id);
    if (!rkakl)
      return res.status(404).json({ message: "Rkakl tidak ditemukan" });

    // 2. Ambil user dari MySQL berdasarkan rkakl.user_id
    const user = await User.findByPk(rkakl.user_id);

    // 3. Gabungkan
    const response = {
      ...rkakl,
      tanggal_dibuat: rkakl.tanggal_dibuat,
      user: user
        ? {
            id: user.id,
            nama: user.nama,
            username: user.username,
          }
        : null,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getRkaklById:", error);
    res.status(500).json({ message: "Gagal mengambil data rkakl" });
  }
};

export const createNewRkakl = async (req, res) => {
  try {
    const userId = req.user.id; // dari middleware JWT
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Validasi user ada di DB
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const { rencana_kerja, deskripsi, status, kategori, link_anggaran } = req.body;
    if (!rencana_kerja || !deskripsi || !link_anggaran) {
      return res.status(400).json({ message: "rencana_kerja, deskripsi, dan link_anggaran wajib diisi" });
    }

    const newRkakl = await RkaklModel.createNewRkakl({
      user_id: userId,
      rencana_kerja,
      deskripsi,
      status: status || "pending",
      kategori: kategori || null,
      link_anggaran
    });

    res.status(201).json(newRkakl);
  } catch (error) {
    console.error("Error createRkakl:", error);
    res.status(500).json({ message: "Gagal membuat rkakl" });
  }
};

export const updateRkaklById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rencana_kerja: rencana_kerja, deskripsi: deskripsi, status, kategori, link_anggaran } = req.body;

    const rkakl = await RkaklModel.getRkaklById(id);
    if (!rkakl)
      return res.status(404).json({ message: "Rkakl tidak ditemukan" });

    const updatedRkakl = await RkaklModel.updateRkaklById(id, {
      rencana_kerja: rencana_kerja || rkakl.rencana_kerja,
      deskripsi: deskripsi || rkakl.deskripsi,
      status: status || rkakl.status,
      kategori: kategori || rkakl.kategori,
      link_anggaran: link_anggaran || rkakl.link_anggaran
    });

    res.json(updatedRkakl);
  } catch (error) {
    console.error("Error updateRkakl:", error);
    res.status(500).json({ message: "Gagal memperbarui rkakl" });
  }
};

export const deleteRkaklById = async (req, res) => {
  try {
    const { id } = req.params;
    const rkakl = await RkaklModel.getRkaklById(id);
    if (!rkakl)
      return res.status(404).json({ message: "Rkakl tidak ditemukan" });

    await RkaklModel.deleteRkakl(id);
    res.json({ message: "Rkakl berhasil dihapus" });
  } catch (error) {
    console.error("Error deleteRkakl:", error);
    res.status(500).json({ message: "Gagal menghapus rkakl" });
  }
};
export const getStatsByStatus = async (req, res) => {
  try {
    const userId = req.user.id; // dari middleware auth
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const stats = await RkaklModel.countByStatus(userId);
    res.json(stats); // kirim array statistik status
  } catch (error) {
    console.error("Error getStatsByStatus:", error);
    res.status(500).json({ error: "Gagal mengambil statistik rkakl." });
  }
};

export const getStatsByStatusAdmin = async (req, res) => {
  try {
    const stats = await RkaklModel.countByStatusAll();
    res.json(stats);
  } catch (error) {
    console.error("Error getStatsByStatusAdmin:", error);
    res.status(500).json({ error: "Gagal mengambil statistik rkakl." });
  }
};

export const getRkaklByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const rkakl = await RkaklModel.getRkaklByUser(userId);
    res.json(rkakl);
  } catch (error) {
    console.error("Error getRkaklByUser:", error);
    res.status(500).json({ message: "Gagal mengambil data rkakl user" });
  }
};
