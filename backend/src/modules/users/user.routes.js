const express = require("express");
const router = express.Router();
const controller = require("./user.controller");
const auth = require("../../middleware/auth.middleware");

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.put("/profile", auth, controller.updateProfile);

module.exports = router;