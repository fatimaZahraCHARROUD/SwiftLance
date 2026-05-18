const express = require("express");
const router = express.Router();

const multer = require("multer");

const fileController = require("./file.controller");

const auth = require("../../middleware/auth.middleware");

router.use(auth);

//this function defines HOW and WHERE files are stored
//rules
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },

});
//This creates the actual middleware used in routes :Use this storage strategy when handling file uploads.
//engine
const upload = multer({ storage });



// GET FILES
router.get("/", fileController.getFiles);
router.get("/project/:projectId", fileController.getFilesByProject);

// CREATE FILE
router.post( "/", upload.single("file"), fileController.createFile);

// DELETE FILE
router.delete("/:id", fileController.deleteFile);

module.exports = router;