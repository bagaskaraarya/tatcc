// models/User.js
import { Sequelize } from "sequelize";
import db from "../config/mysql.js";

const User = db.define(
  "users", {
    nama: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nim: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM("mahasiswa", "admin"),
      allowNull: false,
      defaultValue: "mahasiswa",
    },
  },
  {
    freezeTableName: true,
    createdAt: "tanggal_dibuat",
    updatedAt: "tanggal_diperbarui",
  }
);

export default User;

// Sync table (otomatis buat/ubah tabel saat server jalan)
(async () => {
  await db.sync();
})();