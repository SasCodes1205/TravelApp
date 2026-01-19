const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  type: {
    type: String,
    enum: ["Hotel", "Flight", "Activity", "Other"],
    required: true,
  },
  checkin: {
    type: Date,
    required: true,
  },
  checkout: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

// Pre-save hook to ensure checkout is after checkin
bookingSchema.pre("save", function (next) {
  if (this.checkout <= this.checkin) {
    return next(new Error("Check-out date must be after check-in date"));
  }
  next();
});

// Static method for finding active bookings
bookingSchema.statics.findActive = function () {
  return this.find({ deleted: false });
};

module.exports = mongoose.model("Booking", bookingSchema);
