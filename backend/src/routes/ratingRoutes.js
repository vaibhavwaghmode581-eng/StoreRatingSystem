const express = require("express");

const router = express.Router();

const {
  rateStore,
  getStoreRatings,
  getMyRatings,
} = require("../controllers/ratingController");

const authMiddleware = require("../middleware/authMiddleware");

// ================= RATINGS =================

// Submit / Update rating
router.post("/", authMiddleware, rateStore);

// Get ratings of a particular store
router.get("/store/:store_id", getStoreRatings);

// Get ratings submitted by logged-in user
router.get("/my", authMiddleware, getMyRatings);

module.exports = router;