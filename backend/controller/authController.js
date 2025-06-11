import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { nim, password } = req.body;

    const user = await User.findOne({ where: { nim } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      {
        id: user.id,
        nim: user.nim,
        nama: user.nama,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: { id: user.id, nama: user.nama, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

export const register = async (req, res) => {
  const { nama, nim, email, password, role } = req.body;

  try {
    // Validasi dsb
    if (!nama || !nim || !email || !password) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    // Cek apakah nim/email sudah ada
    const existingUser = await User.findOne({ where: { nim } });
    if (existingUser) {
      return res.status(400).json({ message: "NIM sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nama,
      nim,
      email,
      password: hashedPassword,
      role: role || "mahasiswa",
    });

    res.status(201).json({ message: "Registrasi berhasil", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "Logout berhasil" });
};