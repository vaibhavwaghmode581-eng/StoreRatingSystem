const adminMiddleware = (req, res, next) => {
  try {
    // Check whether user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check admin role
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // User is admin
    next();
  } catch (error) {
    console.error("ADMIN MIDDLEWARE ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

module.exports = adminMiddleware;