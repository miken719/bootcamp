const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCoursesByID,
  addCourses,
  deleteCourses,
} = require("../controller/courses");

router.route("/").get(getCourses).post(addCourses);
router.route("/:id").get(getCoursesByID).delete(deleteCourses);
module.exports = router;
