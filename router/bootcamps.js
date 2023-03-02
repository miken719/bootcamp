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
const advancedResult = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");
const Bootcamp = require("../Schema/bootcampSchema");
const courseRoutes = require("./courses");

//Includes course routes
router.use("/:bootcampId/courses", courseRoutes);
//GET bootcamps in Radius
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/bootcourses").get(getBootcampsCourses);
//GET POST
router
  .route("/")
  .get(
    advancedResult(Bootcamp, {
      path: "courses",
      select: "title description",
    }),
    getBootcamps
  )
  .post(protect, createBootcamp);

router.route("/:id/photo").put(uploadPhoto);

//GET PUT DELETE ROUTES
router
  .route("/:id")
  .get(getBootcampById)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;
