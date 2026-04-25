const projectService = require("./project.services");

// Create
exports.createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(
      req.body,
      req.user.id
    );
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all
exports.getProjects = async (req, res) => {
  try {
    const projects = await projectService.getProjects(req.user.id);
    res.json(projects);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get by id
exports.getProject = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update
exports.updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(
      req.params.id,
      req.body
    );
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};