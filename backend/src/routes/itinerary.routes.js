const express = require("express");
const router = express.Router();
const Itinerary = require("../models/itinerary.model");

// Create a new itinerary
router.post("/", async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    const savedItinerary = await itinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all itineraries
router.get("/", async (req, res) => {
  try {
    const itineraries = await Itinerary.find()
      .populate("tripId")
      .populate("days.timeslots.location");
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific itinerary by ID
router.get("/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)
      .populate("tripId")
      .populate("days.timeslots.location");
    if (!itinerary)
      return res.status(404).json({ error: "Itinerary not found" });
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an itinerary by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItinerary)
      return res.status(404).json({ error: "Itinerary not found" });
    res.status(200).json(updatedItinerary);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an itinerary by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deletedItinerary)
      return res.status(404).json({ error: "Itinerary not found" });
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
