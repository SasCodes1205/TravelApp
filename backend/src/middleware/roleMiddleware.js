// Middleware to check user roles
const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role; // Assuming req.user contains the authenticated user details

      if (!userRole || userRole !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient permissions." });
      }

      next(); // User has the required role, proceed to the next middleware or route handler
    } catch (error) {
      console.error("Role validation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = roleMiddleware;
