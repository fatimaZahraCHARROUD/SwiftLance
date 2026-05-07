const Project = require("./project.model");

// Create project
exports.createProject = async (data, userId) => {
  return await Project.create({
    ...data,
    createdBy: userId,
  });
};

// Get all projects (user-based)
exports.getProjects = async (user_id) => {
  return await Project.find({ createdBy: user_id })
    .populate("client", "fullName email");
};

// Get single project
exports.getProjectById = async (id) => {
  return await Project.findById(id).populate("client createdBy");
};

// Update project
exports.updateProject = async (id, data) => {
  return await Project.findByIdAndUpdate(id, data, { new: true });
};

// Delete project
exports.deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};