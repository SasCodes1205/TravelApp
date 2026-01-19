const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: {
    type: String,
    required: true, // Name is mandatory
  },
  address: {
    type: String,
    required: true, // Address is mandatory
  },
  type: {
    type: String,
    enum: ["Hotel", "Restaurant", "Attraction", "Other", "Cafe"], // Predefined categories
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5, // Ratings are on a scale from 0 to 5
  },
  description: {
    type: String, // Optional field for additional details
  },
  image: {
    type: String, // URL or path for an image
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip", // Reference to the Trips model
    required: true, // Mandatory field
  },
});

//TO DO: girlie u have to connect the google map api so that we can search the locations from google mapsss and get the info from theree

module.exports = mongoose.model("Location", locationSchema);
