const File = require("./file.model");
const fs = require("fs");//module file system
const path = require("path");


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

  //  extract filename from URL
  const filePath = path.join(
    __dirname,
    "../../../uploads/",
    file.url.split("/uploads/")[1]
  );

  //  delete from disk
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("File delete error:", err);
    }
  });

  //  delete from DB
  return await File.findByIdAndDelete(id);
};

module.exports = {
  createFile,
  getAllFiles,
  deleteFile,
  getFilesByProject
};