import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token kosong" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;  // simpan payload JWT ke req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

// Role based middleware
export const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  return res.status(403).json({ message: "Akses hanya untuk admin" });
};

export const isMahasiswa = (req, res, next) => {
  if (req.user.role === "mahasiswa") return next();
  return res.status(403).json({ message: "Akses hanya untuk mahasiswa" });
};
