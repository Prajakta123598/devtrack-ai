const express = require("express");
const router = express.Router();

const {
  createBug,
  getBugs,
  updateBug,
  deleteBug,
} = require("../controllers/bugController");

const { protect } = require("../middleware/authMiddleware");

// Create bug
router.post("/", protect, createBug);

// Get bugs by project
router.get("/:projectId", protect, getBugs);

// Update bug
router.put("/:id", protect, updateBug);

// Delete bug
router.delete("/:id", protect, deleteBug);

module.exports = router;