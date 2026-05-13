const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth.middleware");
const controller = require("./planning.controller");

router.post("/", auth, controller.createPlanning);
router.get("/", auth, controller.getPlannings);
router.get("/:id", auth, controller.getPlanning);
router.put("/:id", auth, controller.updatePlanning);
router.delete("/:id", auth, controller.deletePlanning);

module.exports = router;