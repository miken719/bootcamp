const Course = require("../Schema/courseSchema");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../middleware/error");
const bootcampSchema = require("../Schema/bootcampSchema");
const courseSchema = require("../Schema/courseSchema");

// @desc      Get  Courses
// @routes    GET /api/v1/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res) => {
  if (req.params.bootcampId) {
    const course = await Course.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,

      course: course,
    });
  } else {
    res.status(200).json(res.advancedResult);
  }
});

// @desc      Get  Courses By ID
// @routes    GET /api/v1/courses
// @access    Public
exports.getCoursesByID = asyncHandler(async (req, res, next) => {
  const courses = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!courses) {
    return next(
      new ErrorResponse(`No courses found on id:- ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: courses,
  });
});

// @desc      Add  Courses
// @routes    POST /api/v1/courses
// @access    Private
exports.addCourses = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await bootcampSchema.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found on id:- ${req.params.id}`, 404)
    );
  }
  const courses = await courseSchema.create(req.body);
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add Bootcamp add course to bootcamp ${bootcamp._id}`,
        400
      )
    );
  }
  res.status(200).json({ status: true, data: courses });
});

// @desc      Delete  Courses
// @routes    DELETE /api/v1/courses
// @access    Private
exports.deleteCourses = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const courses = await courseSchema.findById(id);
  if (courses.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add Bootcamp  add course to bootcamp ${courses._id}`,
        400
      )
    );
  }
  if (!courses) {
    next(new ErrorResponse(`Something went wrong`, 404));
  } else {
    courses.remove();
    res.status(200).json({
      status: true,
      data: {},
    });
  }
});
