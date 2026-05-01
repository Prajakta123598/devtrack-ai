const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { projectName, description } = req.body;

  if (!projectName || !description) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const project = await Project.create({
    user: req.user._id,
    projectName,
    description,
  });

  res.status(201).json(project);
});

// @desc    Get logged in user's projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user._id });
  res.status(200).json(projects);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await project.deleteOne();

  res.status(200).json({ message: "Project removed" });
});

module.exports = {
  createProject,
  getProjects,
  deleteProject,
};