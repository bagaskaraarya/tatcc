// controllers/userController.js
import User from "../model/userModel.js";
import bcrypt from "bcrypt";

// 🔍 GET semua user
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "nama",
        "nim",
        "email",
        "role",
        "tanggal_dibuat",
        "tanggal_diperbarui",
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error getUsers:", error); // Tambahkan ini
    res.status(500).json({ message: "Gagal mengambil data users" });
  }
};

// 🔍 GET user berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["nama", "nim", "email", "password", "role"],
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil user" });
  }
};

// ✅ POST buat user baru
export const createUser = async (req, res) => {
  try {
    let { nama, nim, email, password, role } = req.body;

    const allowedRoles = ["mahasiswa", "admin"];
    if (!allowedRoles.includes(role)) {
      role = "mahasiswa"; // default jika role tidak valid
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nama,
      nim,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User berhasil dibuat", data: newUser });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "NIM atau Email sudah terdaftar" });
    }
    res.status(500).json({ message: "Gagal membuat user" });
  }
};
// ✏️ PUT update user
export const updateUser = async (req, res) => {
  try {
    const { nama, nim, email, password, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    let hashedPassword = user.password;
    if (password && password !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.update({
      nama,
      nim,
      email,
      password: hashedPassword,
      role,
    });

    res.status(200).json({ message: "User berhasil diperbarui", data: user });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui user" });
  }
};

// ❌ DELETE hapus user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    await user.destroy();
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus user" });
  }
};
