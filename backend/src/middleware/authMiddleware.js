const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); // Example user model

// Local authentication strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "User not found" });

      const isMatch = await user.matchPassword(password); // Assume matchPassword method
      if (!isMatch) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// JWT-based protection middleware
const protect = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach decoded user to req.user
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Role-based access control middleware
const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Ensure req.user is populated by `protect` middleware
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Fetch the user from the database to check the role
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.role !== requiredRole) {
        return res
          .status(403)
          .json({ message: "Access denied. Insufficient permissions." });
      }

      next(); // User has the required role
    } catch (error) {
      console.error("Role validation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = { passport, protect, roleMiddleware };
