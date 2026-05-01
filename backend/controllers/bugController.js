const asyncHandler = require("express-async-handler");
const Bug = require("../models/Bug");
const Project = require("../models/Project");
const { suggestPriority, isDuplicateBug } = require("../utils/bugUtils");

// Create Bug
const createBug = asyncHandler(async (req, res) => {
  const { projectId, title, description, severity, rootCause } = req.body;

  if (!projectId || !title || !description) {
    res.status(400);
    throw new Error("Please add required fields");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check if project belongs to logged-in user
  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to add bugs in this project");
  }

  // Find existing bugs in same project
  const existingBugs = await Bug.find({ project: projectId });

  // Duplicate check
  const duplicateFound = isDuplicateBug(title, existingBugs);

  // Auto priority suggestion
  const priority = suggestPriority(title, description, severity || "Low");

  const bug = await Bug.create({
    user: req.user._id,
    project: projectId,
    title,
    description,
    severity,
    rootCause,
    priority,
  });

  // Update bug count in project
  const updatedBugCount = await Bug.countDocuments({ project: projectId });
  project.bugCount = updatedBugCount;
  await project.save();

  res.status(201).json({
    message: duplicateFound
      ? "Bug created, but similar title already exists in this project"
      : "Bug created successfully",
    duplicateWarning: duplicateFound,
    bug,
  });
});

// Get Bugs by Project
const getBugs = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to view bugs of this project");
  }

  const bugs = await Bug.find({
    user: req.user._id,
    project: req.params.projectId,
  }).sort({ createdAt: -1 });

  res.status(200).json(bugs);
});

// Update Bug
const updateBug = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id);

  if (!bug) {
    res.status(404);
    throw new Error("Bug not found");
  }

  if (bug.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedData = {
    title: req.body.title || bug.title,
    description: req.body.description || bug.description,
    severity: req.body.severity || bug.severity,
    status: req.body.status || bug.status,
    rootCause: req.body.rootCause || bug.rootCause,
  };

  // Recalculate priority on update
  updatedData.priority = suggestPriority(
    updatedData.title,
    updatedData.description,
    updatedData.severity
  );

  const updatedBug = await Bug.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
  });

  res.status(200).json(updatedBug);
});

// Delete Bug
const deleteBug = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id);

  if (!bug) {
    res.status(404);
    throw new Error("Bug not found");
  }

  if (bug.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const projectId = bug.project;

  await bug.deleteOne();

  // Update bug count after delete
  const project = await Project.findById(projectId);
  if (project) {
    const updatedBugCount = await Bug.countDocuments({ project: projectId });
    project.bugCount = updatedBugCount;
    await project.save();
  }

  res.status(200).json({ message: "Bug removed" });
});

module.exports = {
  createBug,
  getBugs,
  updateBug,
  deleteBug,
};