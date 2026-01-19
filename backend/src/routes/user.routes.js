const express = require("express");
const bcrypt = require("bcrypt");
const Trip = require("../models/trips.model");
const User = require("../models/user.model");

const router = express.Router();

// Create a new user (Sign Up) - postman test DONE
router.post("/signup", async (req, res) => {
  try {
    const { name, phone, country, gender, username, email, password } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = new User({
      name,
      phone,
      country,
      gender,
      username,
      email,
      password,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

// Login a user - postman test DONE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

// Get all users - postman test DONE
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    const usersWithParticipatingTripIds = await Promise.all(
      users.map(async (user) => {
        const participatingTrips = await Trip.find({
          participants: user._id,
        }).select("_id"); // Only select the _id field

        return {
          ...user.toObject(),
          participatingTrips: participatingTrips.map((trip) => trip._id), // Extract only the IDs
        };
      })
    );
    res.status(200).json(usersWithParticipatingTripIds);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching users with participating trip IDs",
      error: err.message,
    });
  }
});

// Get a user by ID - postman test DONE
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
});

// Update a user - postman test DONE
router.put("/:id", async (req, res) => {
  try {
    const { name, phone, country, gender, username, email, password } =
      req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (country) user.country = country;
    if (gender) user.gender = gender;
    if (username) user.username = username;
    if (email) user.email = email;

    // If password is provided, update it (the pre-save hook will handle hashing)
    if (password) user.password = password;

    // Save the user (triggers the pre-save hook for hashing passwords)
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
});

// Delete a user- postman test DONE
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
});
// GET: Get user with trip names - postman test DONE
router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("tripNames");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user, trips: user.tripNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user data", error });
  }
});

// Get categorized trips (current, upcoming, past) for a user
router.get("/:userId/trips/status", async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all trips where the user is a participant
    const trips = await Trip.find({ participants: userId });

    const currentDate = new Date();

    // Categorize trips
    const categorizedTrips = {
      past: trips.filter((trip) => new Date(trip.endDate) < currentDate),
      current: trips.filter(
        (trip) =>
          new Date(trip.startDate) <= currentDate &&
          new Date(trip.endDate) >= currentDate
      ),
      upcoming: trips.filter((trip) => new Date(trip.startDate) > currentDate),
    };

    res.status(200).json({
      message: "Trips fetched successfully",
      userId,
      categorizedTrips,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching trips", error: err.message });
  }
});

module.exports = router;
