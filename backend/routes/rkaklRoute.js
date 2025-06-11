import express from "express";
import {
  getRkakl,
  getRkaklByID,
  createNewRkakl,
  updateRkaklById,
  deleteRkaklById,
  getStatsByStatus,
  getStatsByStatusAdmin,
  getRkaklByUser,
} from "../controller/rkaklController.js";

import {
  isAuthenticated,
  isAdmin,
  isMahasiswa,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", isAuthenticated, getStatsByStatus); // HARUS DI ATAS :stats
router.get("/admin/stats", isAuthenticated, isAdmin, getStatsByStatusAdmin);
router.get("/user", isAuthenticated, isMahasiswa, getRkaklByUser);

router.get("/", isAuthenticated, getRkakl);
router.get("/:id", isAuthenticated, getRkaklByID);
router.post("/", isAuthenticated, isMahasiswa, createNewRkakl);
router.put("/:id", isAuthenticated, isAdmin, updateRkaklById);
router.patch("/:id", isAuthenticated, isAdmin, updateRkaklById);
router.delete("/:id", isAuthenticated, isAdmin, deleteRkaklById);

export default router;
