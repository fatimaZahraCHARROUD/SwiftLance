const fileService = require("./file.services");

const createFile = async (req, res) => {
  try {

    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const fileData = {
      name: req.file.originalname,

      url: req.file.path || req.file.secure_url,

      type: req.file.mimetype
        ? req.file.mimetype.split("/")[0]
        : "file",
        
      project: req.body.project,
    };

    const file = await fileService.createFile(fileData);

    res.status(201).json(file);

  } catch (err) {

    console.log("UPLOAD ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};

const getFiles = async (req, res) => {
  try {

    const files = await fileService.getAllFiles();

    res.json(files);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};

const getFilesByProject = async (req, res) => {
  try {
    const files = await fileService.getFilesByProject(req.params.projectId);
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {

    await fileService.deleteFile(req.params.id);

    res.json({
      message: "File deleted",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createFile,
  getFiles,
  deleteFile,
  getFilesByProject,
};