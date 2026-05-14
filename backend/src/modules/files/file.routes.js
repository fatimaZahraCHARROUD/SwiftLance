const express = require("express");
const router = express.Router();

const multer = require("multer");

const fileController = require("./file.controller");

const auth = require("../../middleware/auth.middleware");

// ================= AUTH =================
router.use(auth);

// ================= MULTER =================
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },

});

const upload = multer({ storage });

// ================= ROUTES =================

// GET FILES
router.get("/", fileController.getFiles);
router.get("/project/:projectId", fileController.getFilesByProject);

// CREATE FILE
router.post(
  "/",
  upload.single("file"),
  fileController.createFile
);

// DELETE FILE
router.delete("/:id", fileController.deleteFile);

module.exports = router;