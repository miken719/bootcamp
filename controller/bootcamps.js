const Bootcamp = require("../Schema/bootcampSchema");
const ErrorResponse = require("../middleware/error");
const asyncHandler = require("../middleware/asyncHandler");
const geocoder = require("../middleware/geoCoder");

// @desc      Get All Bootcamps
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  //Copy query
  let reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);
  let queryStr = JSON.stringify(reqQuery);
  // create operators
  const regex = /\b(gt|gte|lt|lte|in)\b/g;
  queryStr.replace(regex, (match) => `$${match}`);
  // Find bootcamps
  query = Bootcamp.find(JSON.parse(queryStr));

  // Fetch select query request
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");

    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //paginations
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  query = query.skip(startIndex).limit(limit);
  const endIndex = page * limit;
  const total = await query.countDocuments().clone();

  const bootcamp = await query.find();
  let pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  return res.status(200).json({
    success: true,
    count: bootcamp.length,
    pagination,
    data: bootcamp,
  });
});

// @desc      Get Bootcamps by ids
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    res.status(400).json({
      status: false,
    });
  } else {
    res.status(200).json({
      status: true,
      data: bootcamp,
    });
  }
});

// @desc      Post All Bootcamps
// @routes    POST /api/v1/bootcamps
// @access    public
exports.createBootcamp = asyncHandler(async (req, res) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    status: true,
    data: bootcamp,
  });
});

// @desc      Update  Bootcamps
// @routes    PUT /api/v1/bootcamps
// @access    public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    res.status(400).json({
      status: false,
    });
  } else {
    res.status(200).json({
      status: true,
      data: bootcamp,
    });
  }
});

// @desc      Delete  Bootcamps
// @routes    DELETE /api/v1/bootcamps
// @access    public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const bootcamp = await Bootcamp.findByIdAndDelete(id);
  if (!bootcamp) {
    res.status(400).json({
      status: false,
    });
  } else {
    res.status(200).json({
      status: true,
      message: "Bootcamp Delete Successfully",
    });
  }
});

// @desc      Get  Bootcamps in Radius
// @routes    GET /api/v1/bootcamps
// @access    public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  let loc = await geocoder.geocode(zipcode);
  let lng = loc[0].longitude;
  let lat = loc[0].latitude;

  // Calc Location by radius
  // Radius of Earth   3,963 Miles   6,378 KM
  let radiusOfEarth = 3963;
  let radius = distance / radiusOfEarth;
  const bootcamp = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: true,
    count: bootcamp.length,
    data: bootcamp,
  });
});
