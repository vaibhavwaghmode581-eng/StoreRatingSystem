const ownerMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "OWNER") {
      return res.status(403).json({
        success: false,
        message: "Store Owner access required",
      });
    }

    next();
  } catch (error) {
    console.error(
      "OWNER MIDDLEWARE ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

module.exports = ownerMiddleware;