const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config(); // Initialize dotenv for environment variables

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Load routes
const userRoutes = require("./src/routes/user.routes"); // Add user routes
const tripRoutes = require("./src/routes/trip.routes"); // Add trip routes
const itineraryRoutes = require("./src/routes/itinerary.routes"); // Add itinerary routes
const locationRoutes = require("./src/routes/location.routes"); // Add location routes
const bookingRoutes = require("./src/routes/booking.routes"); // Add booking routes
const checklistRoutes = require("./src/routes/checklist.routes"); // Add checklist routes
app.use("/api/users", userRoutes); // Prefix for user-related routes
app.use("/api/trips", tripRoutes); // Prefix for trip-related routes
app.use("/api/itineraries", itineraryRoutes); // prefix for itinerary routes
app.use("/api/locations", locationRoutes); // prefix for location routes
app.use("/api/bookings", bookingRoutes); // prefix for booking routes
app.use("/api/checklists", checklistRoutes); // prefix for checklist routes

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
