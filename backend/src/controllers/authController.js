const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const {
  validateEmail,
  validateName,
  validateAddress,
  validatePassword,
} = require("../utils/validation");

// ===============================
// REGISTER USER
// ===============================
const register = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    // Required fields validation
    if (!name || !email || !address || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Name validation
    if (!validateName(name)) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 20 and 60 characters",
      });
    }

    // Email validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Address validation
    if (!validateAddress(address)) {
      return res.status(400).json({
        success: false,
        message: "Address must not exceed 400 characters",
      });
    }

    // Password validation
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }

    // Check if email already exists
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users
       (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role`,
      [name.trim(), email.trim().toLowerCase(), hashedPassword, address.trim(), "USER"]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// ===============================
// LOGIN USER
// ===============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required fields validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Email validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// ===============================
// GET USER PROFILE
// ===============================
const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        address,
        role,
        created_at
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

// ===============================
// UPDATE PASSWORD
// ===============================
const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      currentPassword,
      newPassword,
    } = req.body;

    // Required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password and new password are required",
      });
    }

    // New password validation
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }

    // Get current password from database
    const userResult = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const storedPassword = userResult.rows[0].password;

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      storedPassword
    );

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check new password is different
    const isSamePassword = await bcrypt.compare(
      newPassword,
      storedPassword
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password
    await pool.query(
      `UPDATE users
       SET password = $1
       WHERE id = $2`,
      [hashedPassword, userId]
    );

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(
      "UPDATE PASSWORD ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update password",
    });
  }
};

// ===============================
// EXPORT FUNCTIONS
// ===============================
module.exports = {
  register,
  login,
  getProfile,
  updatePassword,
};