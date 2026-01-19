const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { Schema } = mongoose;

// User Schema (with trips array)
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^0\d{9}$/.test(value), // Phone number validation
      message: "Phone number must start with 0 and be exactly 10 digits long",
    },
  },
  profilePicture: {
    type: String,
  },
  country: {
    type: String,
    enum: ["Sri Lanka", "India", "USA", "UK", "Australia"], // Valid countries
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"], // Gender options
    required: false, // Gender is optional
  },
  username: {
    type: String,
    required: true,
    unique: true, // Username must be unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique
    validate: {
      validator: (value) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value), // Valid email format
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{6,}$/.test(value), // Password validation
      message:
        "Password must be at least 6 characters long, include at least one number, one uppercase letter, and one alphanumeric character",
    },
  },
  preferences: {
    type: String,
    enum: ["adventure", "religious", "relaxing"], // add more categories
  },

  role: {
    type: String,
    default: "user", // Default role is "user"
  },

  // Array of trips associated with the user
  trips: [
    {
      type: Schema.Types.ObjectId, // Reference to the Trip model
      ref: "Trip", // Refers to the Trip model where trips are stored
    },
  ],
});

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  const user = this;

  // Skip hashing if password hasn't been modified
  if (!user.isModified("password")) return next();

  // Hash the password
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  next();
});

// Method to compare passwords with error handling
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Error during password comparison");
  }
};

// Virtual to get trip names (populate trips with trip name)
userSchema.virtual("tripNames", {
  ref: "Trip", // The model to use for populating
  localField: "trips", // Field in the User model
  foreignField: "_id", // Field in the Trip model
  justOne: false, // Return multiple trip names (one for each trip)
  select: "name", // Only include the trip name in the result
});

module.exports = mongoose.model("User", userSchema);
