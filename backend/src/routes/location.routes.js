const express = require("express");
const router = express.Router();
const Location = require("../models/location.model");

// Create a new location
router.post("/add", async (req, res) => {
  try {
    const location = new Location(req.body);
    const savedLocation = await location.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all locations
router.get("/", async (req, res) => {
  try {
    const locations = await Location.find().populate("tripId");
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific location by ID
router.get("/:id", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate("tripId");
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a location by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedLocation)
      return res.status(404).json({ error: "Location not found" });
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a location by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);
    if (!deletedLocation)
      return res.status(404).json({ error: "Location not found" });
    res.status(200).json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
