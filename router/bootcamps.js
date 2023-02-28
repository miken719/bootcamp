const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  getBootcampById,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  getBootcampsCourses,
  uploadPhoto,
} = require("../controller/bootcamps");
const courseRoutes = require("./courses");

//Includes course routes

router.use("/:bootcampId/courses", courseRoutes);
//GET bootcamps in Radius
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/bootcourses").get(getBootcampsCourses);
//GET POST
router.route("/").get(getBootcamps).post(createBootcamp);

router.route("/:id/photo").put(uploadPhoto);

//GET PUT DELETE ROUTES
router
  .route("/:id")
  .get(getBootcampById)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
