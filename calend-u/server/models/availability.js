const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    slotDuration: {
      type: Number,
      required: true,
      default: 30,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("availability", availabilitySchema);