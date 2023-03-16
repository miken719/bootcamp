const express = require("express");
const advancedResult = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
const User = require("../Schema/registerSchema");
const router = express.Router();
const {
  getUser,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controller/user");

router.use(protect);
router.use(authorize("admin"));

router.get("/", advancedResult(User), getUsers);
router.post("/", createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
