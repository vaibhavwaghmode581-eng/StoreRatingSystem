const express = require("express");

const router = express.Router();

const {
  createStore,
  getStores,
  getStoreById,
} = require("../controllers/storeController");

// ================= STORE ROUTES =================

// Create new store
router.post("/", createStore);

// Get all stores
router.get("/", getStores);

// Get single store by ID
router.get("/:id", getStoreById);

module.exports = router;