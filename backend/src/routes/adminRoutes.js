const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  createUser,
  createStore,
  getUsers,
  getUserById,
  getStores,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ==========================================
// ADMIN DASHBOARD
// ==========================================
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

// ==========================================
// CREATE USER
// ==========================================
router.post(
  "/users",
  authMiddleware,
  adminMiddleware,
  createUser
);

// ==========================================
// GET USERS
// ==========================================
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getUsers
);

// ==========================================
// GET USER BY ID
// ==========================================
router.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  getUserById
);

// ==========================================
// CREATE STORE
// ==========================================
router.post(
  "/stores",
  authMiddleware,
  adminMiddleware,
  createStore
);

// ==========================================
// GET STORES
// ==========================================
router.get(
  "/stores",
  authMiddleware,
  adminMiddleware,
  getStores
);

module.exports = router;