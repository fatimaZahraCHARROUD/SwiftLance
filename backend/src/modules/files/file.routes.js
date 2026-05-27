const express = require("express");
const router = express.Router();
const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const cloudinary = require("../../config/cloudinary");
const multer = require("multer");

const fileController = require("./file.controller");

const auth = require("../../middleware/auth.middleware");

router.use(auth);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "swiftlance-files",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "pdf",
 
    ],
  },
});
//This creates the actual middleware used in routes :Use this storage strategy when handling file uploads.
//engine
const upload = multer({ storage });



// GET FILES
router.get("/",auth, fileController.getFiles);
router.get("/project/:projectId", auth,fileController.getFilesByProject);

// CREATE FILE
router.post( "/", auth, upload.single("file"), fileController.createFile);

// DELETE FILE
router.delete("/:id",auth, fileController.deleteFile);

module.exports = router;