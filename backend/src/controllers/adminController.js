const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const {
  validateEmail,
  validateName,
  validateAddress,
  validatePassword,
} = require("../utils/validation");

// =====================================================
// ADMIN DASHBOARD
// =====================================================

const getDashboardStats = async (req, res) => {
  try {
    const usersResult = await pool.query(
      "SELECT COUNT(*) AS total_users FROM users"
    );

    const storesResult = await pool.query(
      "SELECT COUNT(*) AS total_stores FROM stores"
    );

    const ratingsResult = await pool.query(
      "SELECT COUNT(*) AS total_ratings FROM ratings"
    );

    res.json({
      success: true,
      stats: {
        total_users: Number(
          usersResult.rows[0].total_users
        ),
        total_stores: Number(
          storesResult.rows[0].total_stores
        ),
        total_ratings: Number(
          ratingsResult.rows[0].total_ratings
        ),
      },
    });
  } catch (error) {
    console.error(
      "DASHBOARD STATS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

// =====================================================
// CREATE USER
// =====================================================

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      address,
      role,
    } = req.body;

    // -----------------------------------------------
    // REQUIRED FIELDS
    // -----------------------------------------------

    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // -----------------------------------------------
    // NAME VALIDATION
    // -----------------------------------------------

    if (!validateName(name)) {
      return res.status(400).json({
        success: false,
        message:
          "Name must be between 20 and 60 characters",
      });
    }

    // -----------------------------------------------
    // EMAIL VALIDATION
    // -----------------------------------------------

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // -----------------------------------------------
    // ADDRESS VALIDATION
    // -----------------------------------------------

    if (!validateAddress(address)) {
      return res.status(400).json({
        success: false,
        message:
          "Address must not exceed 400 characters",
      });
    }

    // -----------------------------------------------
    // PASSWORD VALIDATION
    // -----------------------------------------------

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }

    // -----------------------------------------------
    // ROLE VALIDATION
    // -----------------------------------------------

    const allowedRoles = [
      "USER",
      "ADMIN",
      "OWNER",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // -----------------------------------------------
    // CHECK EMAIL
    // -----------------------------------------------

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // -----------------------------------------------
    // HASH PASSWORD
    // -----------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // -----------------------------------------------
    // INSERT USER
    // -----------------------------------------------

    const result = await pool.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password,
        address,
        role
      )
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        email,
        address,
        role
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        hashedPassword,
        address.trim(),
        role,
      ]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(
      "CREATE USER ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

// =====================================================
// GET USERS
// =====================================================

const getUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      order = "asc",
    } = req.query;

    const values = [];
    const conditions = [];

    // -----------------------------------------------
    // NAME FILTER
    // -----------------------------------------------

    if (name) {
      values.push(`%${name}%`);

      conditions.push(
        `u.name ILIKE $${values.length}`
      );
    }

    // -----------------------------------------------
    // EMAIL FILTER
    // -----------------------------------------------

    if (email) {
      values.push(`%${email}%`);

      conditions.push(
        `u.email ILIKE $${values.length}`
      );
    }

    // -----------------------------------------------
    // ADDRESS FILTER
    // -----------------------------------------------

    if (address) {
      values.push(`%${address}%`);

      conditions.push(
        `u.address ILIKE $${values.length}`
      );
    }

    // -----------------------------------------------
    // ROLE FILTER
    // -----------------------------------------------

    if (role) {
      values.push(role);

      conditions.push(
        `u.role = $${values.length}`
      );
    }

    // -----------------------------------------------
    // BASE QUERY
    // -----------------------------------------------

    let query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.address,
        u.role,
        u.created_at
      FROM users u
    `;

    // -----------------------------------------------
    // WHERE
    // -----------------------------------------------

    if (conditions.length > 0) {
      query += `
        WHERE ${conditions.join(" AND ")}
      `;
    }

    // -----------------------------------------------
    // SORTING
    // -----------------------------------------------

    const allowedSortFields = {
      id: "u.id",
      name: "u.name",
      email: "u.email",
      address: "u.address",
      role: "u.role",
      created_at: "u.created_at",
    };

    const selectedSort =
      allowedSortFields[sortBy] ||
      "u.name";

    const selectedOrder =
      String(order).toLowerCase() === "desc"
        ? "DESC"
        : "ASC";

    query += `
      ORDER BY
      ${selectedSort}
      ${selectedOrder}
    `;

    // -----------------------------------------------
    // EXECUTE
    // -----------------------------------------------

    const result = await pool.query(
      query,
      values
    );

    res.json({
      success: true,
      total_users: result.rows.length,
      users: result.rows,
    });
  } catch (error) {
    console.error(
      "GET USERS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// =====================================================
// GET USER BY ID
// =====================================================

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = Number(id);

    // -----------------------------------------------
    // VALIDATE ID
    // -----------------------------------------------

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // -----------------------------------------------
    // GET USER
    // -----------------------------------------------

    const userResult = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        address,
        role,
        created_at
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = userResult.rows[0];

    // -----------------------------------------------
    // OWNER STORE INFORMATION
    // -----------------------------------------------

    if (user.role === "OWNER") {
      const storeResult = await pool.query(
        `
        SELECT
          s.id,
          s.name,
          s.email,
          s.address,
          s.owner_id,

          COALESCE(
            ROUND(AVG(r.rating), 2),
            0
          ) AS average_rating,

          COUNT(r.id) AS total_ratings

        FROM stores s

        LEFT JOIN ratings r
          ON s.id = r.store_id

        WHERE s.owner_id = $1

        GROUP BY
          s.id,
          s.name,
          s.email,
          s.address,
          s.owner_id

        ORDER BY
          s.name ASC
        `,
        [user.id]
      );

      // ---------------------------------------------
      // OWNER WITH STORE
      // ---------------------------------------------

      if (storeResult.rows.length > 0) {
        const store = storeResult.rows[0];

        return res.json({
          success: true,

          user: {
            ...user,

            store: {
              ...store,

              average_rating: Number(
                store.average_rating || 0
              ),

              total_ratings: Number(
                store.total_ratings || 0
              ),
            },
          },
        });
      }

      // ---------------------------------------------
      // OWNER WITHOUT STORE
      // ---------------------------------------------

      return res.json({
        success: true,

        user: {
          ...user,
          store: null,
        },
      });
    }

    // -----------------------------------------------
    // NORMAL USER / ADMIN
    // -----------------------------------------------

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "GET USER BY ID ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

// =====================================================
// CREATE STORE
// =====================================================

const createStore = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      owner_id,
    } = req.body;

    // -----------------------------------------------
    // REQUIRED FIELDS
    // -----------------------------------------------

    if (!name || !email || !address) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and address are required",
      });
    }

    // -----------------------------------------------
    // NAME VALIDATION
    // -----------------------------------------------

    if (!validateName(name)) {
      return res.status(400).json({
        success: false,
        message:
          "Store name must be between 20 and 60 characters",
      });
    }

    // -----------------------------------------------
    // EMAIL VALIDATION
    // -----------------------------------------------

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // -----------------------------------------------
    // ADDRESS VALIDATION
    // -----------------------------------------------

    if (!validateAddress(address)) {
      return res.status(400).json({
        success: false,
        message:
          "Address must not exceed 400 characters",
      });
    }

    // -----------------------------------------------
    // OWNER VALIDATION
    // -----------------------------------------------

    if (
      owner_id !== undefined &&
      owner_id !== null &&
      owner_id !== ""
    ) {
      const ownerResult = await pool.query(
        `
        SELECT
          id,
          role
        FROM users
        WHERE id = $1
        `,
        [owner_id]
      );

      if (ownerResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Owner user not found",
        });
      }

      if (ownerResult.rows[0].role !== "OWNER") {
        return res.status(400).json({
          success: false,
          message:
            "Selected user is not a Store Owner",
        });
      }
    }

    // -----------------------------------------------
    // CREATE STORE
    // -----------------------------------------------

    const result = await pool.query(
      `
      INSERT INTO stores
      (
        name,
        email,
        address,
        owner_id
      )
      VALUES
      ($1, $2, $3, $4)

      RETURNING
        id,
        name,
        email,
        address,
        owner_id
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        address.trim(),
        owner_id || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store: result.rows[0],
    });
  } catch (error) {
    console.error(
      "CREATE STORE ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to create store",
    });
  }
};

// =====================================================
// GET STORES - ADMIN
// =====================================================

const getStores = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      sortBy = "name",
      order = "asc",
    } = req.query;

    const values = [];
    const conditions = [];

    // -----------------------------------------------
    // NAME FILTER
    // -----------------------------------------------

    if (name) {
      values.push(`%${name}%`);

      conditions.push(
        `s.name ILIKE $${values.length}`
      );
    }

    // -----------------------------------------------
    // EMAIL FILTER
    // -----------------------------------------------

    if (email) {
      values.push(`%${email}%`);

      conditions.push(
        `s.email ILIKE $${values.length}`
      );
    }

    // -----------------------------------------------
    // ADDRESS FILTER
    // -----------------------------------------------

    if (address) {
      values.push(`%${address}%`);

      conditions.push(
        `s.address ILIKE $${values.length}`
      );
    }

    // -----------------------------------------------
    // BASE QUERY
    // -----------------------------------------------

    let query = `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,

        COALESCE(
          ROUND(AVG(r.rating), 2),
          0
        ) AS average_rating,

        COUNT(r.id) AS total_ratings

      FROM stores s

      LEFT JOIN ratings r
        ON s.id = r.store_id
    `;

    // -----------------------------------------------
    // WHERE
    // -----------------------------------------------

    if (conditions.length > 0) {
      query += `
        WHERE ${conditions.join(" AND ")}
      `;
    }

    // -----------------------------------------------
    // GROUP BY
    // -----------------------------------------------

    query += `
      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id
    `;

    // -----------------------------------------------
    // SORTING
    // -----------------------------------------------

    const allowedSortFields = {
      id: "s.id",
      name: "s.name",
      email: "s.email",
      address: "s.address",
      rating: "average_rating",
    };

    const selectedSort =
      allowedSortFields[sortBy] ||
      "s.name";

    const selectedOrder =
      String(order).toLowerCase() === "desc"
        ? "DESC"
        : "ASC";

    query += `
      ORDER BY
      ${selectedSort}
      ${selectedOrder}
    `;

    // -----------------------------------------------
    // EXECUTE
    // -----------------------------------------------

    const result = await pool.query(
      query,
      values
    );

    res.json({
      success: true,
      total_stores: result.rows.length,
      stores: result.rows,
    });
  } catch (error) {
    console.error(
      "GET ADMIN STORES ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getDashboardStats,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
};