const express = require("express");
const router = express.Router();

const controller = require("./project.controller");
const auth = require("../../middleware/auth.middleware");

// Create project
router.post("/", auth, controller.createProject);

// Get all projects
router.get("/", auth, controller.getProjects);

// Get single project
router.get("/:id", auth, controller.getProject);

// Update project
router.put("/:id", auth, controller.updateProject);

// Delete project
router.delete("/:id", auth, controller.deleteProject);

module.exports = router;