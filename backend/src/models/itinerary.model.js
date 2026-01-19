const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itinerarySchema = new Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
  days: [
    {
      dayNumber: {
        type: Number,
        required: true,
        min: 1,
      },
      timeslots: [
        {
          time: {
            type: String,
            required: true,
            match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)$/i,
          },
          location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
            required: function () {
              return !this.activity;
            },
          },
          activity: {
            type: String,
            required: function () {
              return !this.location;
            },
            maxlength: 200,
          },
        },
      ],
    },
  ],
  outfits: [
    {
      dayNumber: {
        type: Number,
        required: true,
        min: 1,
      },
      outfit: {
        type: String,
        maxlength: 100,
      },
      image: {
        type: String,
        validate: {
          validator: function (v) {
            return /^(http|https):\/\/[^ "]+$/.test(v);
          },
          message: "Invalid URL format for image",
        },
      },
    },
  ],
});

// Add pre-save hook to check for consistency between days and outfits
itinerarySchema.pre("save", function (next) {
  const dayNumbers = this.days.map((day) => day.dayNumber);
  const outfitDays = this.outfits.map((outfit) => outfit.dayNumber);

  // Ensure no duplicate day numbers in days
  if (new Set(dayNumbers).size !== dayNumbers.length) {
    return next(new Error("Duplicate day numbers found in days array"));
  }

  // Ensure no mismatch between days and outfits
  const mismatch = outfitDays.some((day) => !dayNumbers.includes(day));
  if (mismatch) {
    return next(
      new Error("Outfit day numbers must match the day numbers in days array")
    );
  }

  next();
});

module.exports = mongoose.model("Itinerary", itinerarySchema);
