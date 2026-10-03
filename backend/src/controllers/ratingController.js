const pool = require("../config/db");

// ================= CREATE / UPDATE RATING =================
const rateStore = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    // Basic validation
    if (!store_id || rating === undefined || rating === null) {
      return res.status(400).json({
        success: false,
        message: "Store ID and rating are required",
      });
    }

    // Convert rating to number
    const ratingValue = Number(rating);
    const storeId = Number(store_id);

    // Validate numbers
    if (!Number.isInteger(storeId)) {
      return res.status(400).json({
        success: false,
        message: "Store ID must be a valid number",
      });
    }

    // Rating must be between 1 and 5
    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 5",
      });
    }

    // Check whether store exists
    const store = await pool.query(
      "SELECT id FROM stores WHERE id = $1",
      [storeId]
    );

    if (store.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Check existing rating
    const existingRating = await pool.query(
      `SELECT id FROM ratings
       WHERE user_id = $1 AND store_id = $2`,
      [user_id, storeId]
    );

    let result;

    // ================= UPDATE EXISTING RATING =================
    if (existingRating.rows.length > 0) {
      result = await pool.query(
        `UPDATE ratings
         SET rating = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND store_id = $3
         RETURNING *`,
        [ratingValue, user_id, storeId]
      );

      return res.json({
        success: true,
        message: "Rating updated successfully",
        rating: result.rows[0],
      });
    }

    // ================= CREATE NEW RATING =================
    result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, storeId, ratingValue]
    );

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      rating: result.rows[0],
    });
  } catch (error) {
    console.error("RATING ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to submit rating",
      error: error.message,
    });
  }
};

// ================= GET RATINGS FOR STORE =================
const getStoreRatings = async (req, res) => {
  try {
    const { store_id } = req.params;

    const storeId = Number(store_id);

    if (!Number.isInteger(storeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
    }

    // Check whether store exists
    const store = await pool.query(
      "SELECT id, name, address FROM stores WHERE id = $1",
      [storeId]
    );

    if (store.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Get ratings
    const result = await pool.query(
      `
      SELECT
        r.id,
        r.rating,
        r.created_at,
        r.updated_at,
        u.id AS user_id,
        u.name AS user_name
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
      `,
      [storeId]
    );

    // Calculate average rating
    const averageResult = await pool.query(
      `
      SELECT
        COALESCE(AVG(rating), 0) AS average_rating,
        COUNT(id) AS total_ratings
      FROM ratings
      WHERE store_id = $1
      `,
      [storeId]
    );

    res.json({
      success: true,
      store: store.rows[0],
      average_rating: Number(
        Number(averageResult.rows[0].average_rating).toFixed(2)
      ),
      total_ratings: Number(averageResult.rows[0].total_ratings),
      ratings: result.rows,
    });
  } catch (error) {
    console.error("GET STORE RATINGS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch store ratings",
      error: error.message,
    });
  }
};

// ================= GET MY RATINGS =================
const getMyRatings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `
      SELECT
        r.id,
        r.rating,
        r.created_at,
        r.updated_at,
        s.id AS store_id,
        s.name AS store_name,
        s.address AS store_address
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      `,
      [user_id]
    );

    res.json({
      success: true,
      total_ratings: result.rows.length,
      ratings: result.rows,
    });
  } catch (error) {
    console.error("GET MY RATINGS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your ratings",
      error: error.message,
    });
  }
};

module.exports = {
  rateStore,
  getStoreRatings,
  getMyRatings,
};