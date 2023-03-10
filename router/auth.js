const express = require("express");
const {
  register,
  login,
  getMe,
  getUsers,
  deleteUser,
  forgetPassword,
  resetPassword,
} = require("../controller/auth");
const { protect, manageRole } = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/me", protect, manageRole("publisher", "admin"), getMe);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:resettoken", resetPassword);
module.exports = router;
