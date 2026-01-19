const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Trip = require("../models/trips.model"); // Ensure the path is correct
const User = require("../models/user.model"); // Import the User model

// POST: Create a new trip for a user with optional initial participants
router.post("/create", async (req, res) => {
  try {
    const {
      tripName,
      destination,
      Collaboration,
      StartDate,
      EndDate,
      participants = [],
      Preferences,
      userId,
    } = req.body;

    // Check if the organizer (userId) exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Validate that all provided participant IDs are valid ObjectIds
    const validParticipantIds = participants.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (!validParticipantIds) {
      return res
        .status(400)
        .json({ message: "Invalid participant IDs provided" });
    }

    const newTrip = new Trip({
      tripName,
      destination,
      Collaboration,
      StartDate,
      EndDate,
      participants,
      Preferences,
      userId,
    });

    const savedTrip = await newTrip.save();

    // Update the organizer's trips array
    user.trips.push(savedTrip._id);
    await user.save();

    res.status(201).json(savedTrip);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating trip", error });
  }
});

// GET: Get all trips for a user - postman test DONE
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all trips for the user
    const user = await User.findById(userId).populate("trips"); // Populate trips array
    if (!user || user.trips.length === 0) {
      return res.status(404).json({ message: "No trips found for this user" });
    }

    res.status(200).json(user.trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching trips", error });
  }
});

// GET: Get a specific trip for a user - postman test DONE
router.get("/:userId/:tripId", async (req, res) => {
  try {
    const { userId, tripId } = req.params;

    // Fetch the specific trip for the user
    const trip = await Trip.findOne({ _id: tripId, userId });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found for this user" });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching trip", error });
  }
});

// PUT: Update a trip for a user - postman test DONE
router.put("/:userId/:tripId", async (req, res) => {
  try {
    const { userId, tripId } = req.params;
    const {
      tripName,
      destination,
      Collaboration,
      StartDate,
      EndDate,
      Users,
      Preferences,
    } = req.body;

    // Update the trip only if it belongs to the given user
    const updatedTrip = await Trip.findOneAndUpdate(
      { _id: tripId, userId },
      {
        tripName,
        destination,
        Collaboration,
        StartDate,
        EndDate,
        Users,
        Preferences,
      },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found for this user" });
    }

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error updating trip", error });
  }
});

// PUT: Add participants to a trip
router.put("/:tripId/participants", async (req, res) => {
  console.log("Params received:", req.params);
  try {
    const { tripId } = req.params;
    const { userIds } = req.body;

    console.log("Attempting to update trip with ID:", tripId);

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $addToSet: { participants: { $each: userIds } } },
      { new: true }
    ).populate("participants", "-password");

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(400).json({ message: "Error adding participants", error });
  }
});
// GET: Get all trips where a user is a participant
router.get("/participating/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const trips = await Trip.find({ participants: userId }).populate(
      "organizer",
      "-password"
    );
    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching participating trips", error });
  }
});

// DELETE: Delete a trip for a user - postman test DONE
router.delete("/:userId/:tripId", async (req, res) => {
  try {
    const { userId, tripId } = req.params;

    // Delete the trip only if it belongs to the given user
    const deletedTrip = await Trip.findOneAndDelete({ _id: tripId, userId });
    if (!deletedTrip) {
      return res.status(404).json({ message: "Trip not found for this user" });
    }
    //
    // Remove the trip reference from the user's trips array
    await User.updateOne({ _id: userId }, { $pull: { trips: tripId } });

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting trip", error });
  }
});

module.exports = router;
