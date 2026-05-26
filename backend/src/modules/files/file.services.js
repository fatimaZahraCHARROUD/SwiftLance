const File = require("./file.model");


const createFile = async (data) => {
  return await File.create(data);
};

const getAllFiles = async () => {
  return await File.find()
    .populate("project") //replaces project ID with full project info
    .sort({ createdAt: -1 });//newest files first
};

const getFilesByProject = async (projectId) => {
  return await File.find({ project: projectId })
    .populate("project")
    .sort({ createdAt: -1 });
};

const deleteFile = async (id) => {

  const file = await File.findById(id);

  if (!file) {
    throw new Error("File not found");
  }

  return await File.findByIdAndDelete(id);
};

module.exports = {
  createFile,
  getAllFiles,
  deleteFile,
  getFilesByProject
};