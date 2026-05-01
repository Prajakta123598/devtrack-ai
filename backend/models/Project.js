const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    projectName: {
      type: String,
      required: [true, "Please add project name"],
    },
    description: {
      type: String,
      required: [true, "Please add description"],
    },

    // ⭐ NEW FIELD (Day 5)
    bugCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);