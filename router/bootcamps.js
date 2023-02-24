const express = require("express")
const router = express.Router()
const {
  getBootcamps,
  getBootcampById,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
} = require("../controller/bootcamps")

//GET bootcamps in Radius
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius)

//GET POST
router.route("/").get(getBootcamps).post(createBootcamp)

//GET PUT DELETE ROUTES
router
  .route("/:id")
  .get(getBootcampById)
  .put(updateBootcamp)
  .delete(deleteBootcamp)

module.exports = router
