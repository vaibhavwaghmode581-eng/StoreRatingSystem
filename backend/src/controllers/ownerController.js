const pool = require("../config/db");

// =====================================================
// STORE OWNER DASHBOARD
// =====================================================

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Find stores owned by this owner
    const storesResult = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address
      FROM stores s
      WHERE s.owner_id = $1
      ORDER BY s.name ASC
      `,
      [ownerId]
    );

    if (storesResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No store assigned to this owner",
      });
    }

    const stores = [];

    for (const store of storesResult.rows) {
      // Get average rating
      const ratingResult = await pool.query(
        `
        SELECT
          COALESCE(ROUND(AVG(r.rating), 2), 0) AS average_rating,
          COUNT(r.id) AS total_ratings
        FROM ratings r
        WHERE r.store_id = $1
        `,
        [store.id]
      );

      // Get users who rated the store
      const usersResult = await pool.query(
        `
        SELECT
          u.id AS user_id,
          u.name AS user_name,
          u.email AS user_email,
          r.rating,
          r.created_at
        FROM ratings r
        JOIN users u
          ON r.user_id = u.id
        WHERE r.store_id = $1
        ORDER BY r.created_at DESC
        `,
        [store.id]
      );

      stores.push({
        ...store,
        average_rating: Number(
          ratingResult.rows[0].average_rating
        ),
        total_ratings: Number(
          ratingResult.rows[0].total_ratings
        ),
        rated_users: usersResult.rows,
      });
    }

    res.json({
      success: true,
      owner_id: ownerId,
      stores,
    });
  } catch (error) {
    console.error(
      "OWNER DASHBOARD ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch owner dashboard",
    });
  }
};

module.exports = {
  getOwnerDashboard,
};