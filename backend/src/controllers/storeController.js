const pool = require("../config/db");

// ================= CREATE STORE =================
const createStore = async (req, res) => {
  try {
    const { name, email, address } = req.body;

    // Basic validation
    if (!name || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, email and address are required",
      });
    }

    // Create store
    const result = await pool.query(
      `INSERT INTO stores (name, email, address)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, address`,
      [name, email, address]
    );

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create store",
    });
  }
};


// ================= GET ALL STORES =================
const getStores = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.id;
    `);

    res.json({
      success: true,
      stores: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
    });
  }
};


// ================= GET STORE BY ID =================
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        COALESCE(AVG(r.rating), 0) AS average_rating,
        COUNT(r.id) AS total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id;
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.json({
      success: true,
      store: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch store",
    });
  }
};


// ================= EXPORT =================
module.exports = {
  createStore,
  getStores,
  getStoreById,
};