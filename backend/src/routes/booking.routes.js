const express = require("express");
const { body, validationResult } = require("express-validator");
const { protect, roleMiddleware } = require("../middleware/authMiddleware");
const Booking = require("../models/booking.model");

const router = express.Router();

// Create a new booking
router.post(
  "/",
  [
    body("tripId").isMongoId().withMessage("Invalid Trip ID"),
    body("userId").isMongoId().withMessage("Invalid User ID"),
    body("locationId").isMongoId().withMessage("Invalid Location ID"),
    body("type")
      .isIn(["Hotel", "Flight", "Activity", "Other"])
      .withMessage("Invalid booking type"),
    body("checkin").isISO8601().toDate().withMessage("Invalid check-in date"),
    body("checkout").isISO8601().toDate().withMessage("Invalid check-out date"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a non-negative number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const booking = new Booking(req.body);
      const savedBooking = await booking.save();
      res.status(201).json(savedBooking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all bookings with pagination
router.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const bookings = await Booking.findActive()
      .populate("tripId")
      .populate("userId")
      .populate("locationId")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments({ deleted: false });
    res
      .status(200)
      .json({ total, page: parseInt(page), limit: parseInt(limit), bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific booking by ID
router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .where({ deleted: false })
      .populate("tripId")
      .populate("userId")
      .populate("locationId");

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a booking by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).where({ deleted: false });

    if (!updatedBooking)
      return res.status(404).json({ error: "Booking not found" });

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all active bookings for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.findActive({ userId: req.params.userId })
      .populate("tripId")
      .populate("userId")
      .populate("locationId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all active bookings for a specific trip
router.get("/trip/:tripId", async (req, res) => {
  try {
    const bookings = await Booking.findActive({ tripId: req.params.tripId })
      .populate("tripId")
      .populate("userId")
      .populate("locationId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Soft delete a booking by ID
router.delete("/:id", protect, roleMiddleware("admin"), async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );

    if (!deletedBooking)
      return res.status(404).json({ error: "Booking not found" });

    res.status(200).json({ message: "Booking soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
