import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import database config
import db from "./config/mysql.js"; // MySQL (Sequelize)
import pgPool from "./config/postgresql.js"; // PostgreSQL (pg)

// Import routes
import userRoute from "./routes/userRoute.js";
import rkaklRoute from "./routes/rkaklRoute.js";
import authRoute from "./routes/authRoute.js";

import { isAuthenticated } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://34.60.129.25", "https://api-rkakl-mahasiswa-772045342482.us-central1.run.app"],
    credentials: true,
  })
);
app.use(express.json());

// Tes koneksi database
(async () => {
  try {
    await db.authenticate();
    console.log("✅ Koneksi ke MySQL berhasil.");

    await pgPool.query("SELECT NOW()");
    console.log("✅ Koneksi ke PostgreSQL berhasil.");
  } catch (error) {
    console.error("❌ Gagal koneksi ke database:", error);
  }
})();

// Routes
app.use("/users", userRoute);
app.use("/rkakl", isAuthenticated, rkaklRoute); // middleware JWT nanti pakai isAuthenticated
app.use("/auth", authRoute);

// Default route
app.get("/", (req, res) => {
  res.send("Server berjalan 🔥");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route tidak ditemukan" });
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
