const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checklistSchema = new Schema({
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
  listName: {
    type: String,
    required: true,
  },
  items: [
    // Array to hold the checklist items
    {
      name: {
        type: String,
        required: true,
      },
      isChecked: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model("Checklist", checklistSchema);
