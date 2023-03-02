const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  getCoursesByID,
  addCourses,
  deleteCourses,
} = require("../controller/courses");
const advancedResult = require("../middleware/advancedResults");
const { protect, manageRole } = require("../middleware/auth");
const Course = require("../Schema/courseSchema");

router
  .route("/")
  .get(
    advancedResult(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, manageRole("publisher", "admin"), addCourses);
router
  .route("/:id")
  .get(getCoursesByID)
  .delete(protect, manageRole("publisher", "admin"), deleteCourses);
module.exports = router;
