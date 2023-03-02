const express = require("express");
const { register, login, getMe } = require("../controller/auth");
const { protect, manageRole } = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, manageRole("publisher", "admin"), getMe);
module.exports = router;
