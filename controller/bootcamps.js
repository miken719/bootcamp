const Bootcamp = require("../Schema/bootcampSchema")
const ErrorResponse = require("../middleware/error")
const asyncHandler = require("../middleware/asyncHandler")
// @desc      Get All Bootcamps
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.find()
  return res
    .status(200)
    .json({ success: true, count: bootcamp.length, data: bootcamp })
})

// @desc      Get Bootcamps by ids
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
  const _id = req.params.id
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    res.status(400).json({
      status: false,
    })
  } else {
    res.status(200).json({
      status: true,
      data: bootcamp,
    })
  }
})

// @desc      Post All Bootcamps
// @routes    POST /api/v1/bootcamps
// @access    public
exports.createBootcamp = asyncHandler(async (req, res) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({
    status: true,
    data: bootcamp,
  })
})

// @desc      Update  Bootcamps
// @routes    PUT /api/v1/bootcamps
// @access    public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!bootcamp) {
    res.status(400).json({
      status: false,
    })
  } else {
    res.status(200).json({
      status: true,
      data: bootcamp,
    })
  }
})

// @desc      Delete  Bootcamps
// @routes    DELETE /api/v1/bootcamps
// @access    public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id
  const bootcamp = await Bootcamp.findByIdAndDelete(id)
  if (!bootcamp) {
    res.status(400).json({
      status: false,
    })
  } else {
    res.status(200).json({
      status: true,
      message: "Bootcamp Delete Successfully",
    })
  }
})
