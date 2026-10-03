const express = require("express");

const router = express.Router();

const {
  register,
  login,
  getProfile,
  updatePassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post(
  "/register",
  register
);

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post(
  "/login",
  login
);

// =====================================================
// PROFILE
// GET /api/auth/profile
// =====================================================

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

// =====================================================
// UPDATE PASSWORD
// PUT /api/auth/password
// =====================================================

router.put(
  "/password",
  authMiddleware,
  updatePassword
);

module.exports = router;