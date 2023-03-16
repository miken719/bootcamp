const express = require("express");
const {
  register,
  login,
  getMe,
  deleteUser,
  forgetPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controller/auth");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.delete("/users/:id", deleteUser);
router.get("/me", protect, authorize("publisher", "admin", "user"), getMe);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
module.exports = router;
