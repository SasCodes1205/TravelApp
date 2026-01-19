const mongoose = require("mongoose");
const { Schema } = mongoose;

// List of Sri Lankan districts ( modify this list as needed)
const sriLankanDistricts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Polonnaruwa",
  "Anuradhapura",
  "Kegalle",
  "Ratnapura",
  "Badulla",
  "Monaragala",
  "Kurunegala",
  "Puttalam",
  "Maturata",
  "Kilinocchi",
];

// Trip Schema
const tripSchema = new Schema({
  tripName: {
    type: String,
    required: true, // Ensures that each trip has a name
    trim: true, // Removes leading/trailing spaces
  },
  destination: {
    type: String,
    required: true,
    enum: sriLankanDistricts, // Only allows one of the districts from the list
    message: "{VALUE} is not a valid district in Sri Lanka",
  },
  Collaboration: {
    type: Boolean, // Indicates if the event is a collaboration
    required: true,
    default: false,
  },
  StartDate: {
    type: Date, // Start date of the trip or event
    required: true,
  },
  EndDate: {
    type: Date, // End date of the trip or event
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  Preferences: {
    type: Map, // Stores user preferences like food, activities, etc.
    of: String, // Key-value pairs where both keys and values are strings
    default: {},
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User who owns this trip
    required: true,
  },
});

module.exports = mongoose.model("Trip", tripSchema);
