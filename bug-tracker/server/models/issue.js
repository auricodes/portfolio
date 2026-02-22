
const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    status: {
      type: String,
      enum: ["open", "in_progress", "closed"],
      default: "open",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    labels: [{ type: String, trim: true }],

    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      required: true 
    },

    assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      default: null 
    },

    comments: [
      {
        text: { type: String, required: true, trim: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]

  },
  { timestamps: true }
);

module.exports = mongoose.model("issue", issueSchema);
