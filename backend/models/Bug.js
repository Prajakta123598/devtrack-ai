const mongoose = require("mongoose");

const bugSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    title: {
      type: String,
      required: [true, "Please add bug title"],
    },
    description: {
      type: String,
      required: [true, "Please add description"],
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
    rootCause: {
      type: String,
      default: "Not specified",
    },

    // Day 5 new field
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bug", bugSchema);