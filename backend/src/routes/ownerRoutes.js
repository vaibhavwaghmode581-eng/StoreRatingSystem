const express = require("express");

const router = express.Router();

const {
  getOwnerDashboard,
} = require("../controllers/ownerController");

const authMiddleware = require("../middleware/authMiddleware");
const ownerMiddleware = require("../middleware/ownerMiddleware");

// =====================================================
// OWNER DASHBOARD
// GET /api/owner/dashboard
// =====================================================

router.get(
  "/dashboard",
  authMiddleware,
  ownerMiddleware,
  getOwnerDashboard
);

module.exports = router;